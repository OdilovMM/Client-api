const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });
const express = require("express");
const MyServer = require("./server");
const MyDatabase = require("./database");
const { config } = require("./config");
const app = express();

class Application {
  init() {
    MyDatabase();
    const server = new MyServer(app);
    server.start();
  }

  loadConfig() {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const application = new Application();
application.init();
