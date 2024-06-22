const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const compression = require("compression");
const cookieSession = require("cookie-session");
const { StatusCodes } = require("http-status-codes");

const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const bunyan = require("bunyan");
const apiStats = require("swagger-stats");
const asyncError = require("express-async-errors");
const morgan = require("morgan");
const router = require("./routes");
const { CustomError } = require("./shared/globals/helpers/errorHandler");
const { createLogger } = require("./shared/globals/logger");

const log = createLogger("server");

class MyServer {
  constructor(app) {
    this.app = app;
  }

  start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  securityMiddleware() {
    this.app.use(
      cookieSession({
        name: "session",
        keys: [process.env.JWT_SECRET_ONE, process.env.JWT_SECRET_TWO],
        maxAge: 24 * 7 * 3600000,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "none",
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );

    this.app.use(morgan("dev"));
  }

  standardMiddleware() {
    this.app.use(compression());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  }

  routeMiddleware() {
    router();
  }

  globalErrorHandler() {
    this.app.all("*", (req, res, next) => {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    this.app.use((error, req, res, next) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.StatusCodes).json(error.serializeErrors());
      }
      next();
    });
  }

  async startServer() {
    try {
      const httpServer = http.createServer(this.app);
      const socketIO = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnection(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  async createSocketIO(httpServer) {
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });
    const pubClient = createClient({ url: process.env.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  startHttpServer() {
    console.log(`Server started ${process.pid}`);
    const port = process.env.PORT || 4000;
    const server = http.createServer(this.app);
    server.listen(port || 4000, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  socketIOConnection() {}
}

module.exports = MyServer;
