const mongoose = require("mongoose");
const { createLogger } = require("./shared/globals/logger");
const { config } = require("./config");

const log = createLogger("database");

const MyDatabase = () => {
  const connect = () => {
    mongoose
      .connect(config.DB_URL, {})
      .then(() => {
        console.log("DB connection success!");
      })
      .catch((error) => {
        log.error("Connection Error Ocurred", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};

module.exports = MyDatabase;
