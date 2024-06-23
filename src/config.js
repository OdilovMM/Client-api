const path = require("path");
const bunyan = require("bunyan");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: path.join(__dirname, "config.env") });

class Config {
  constructor() {
    this.DEFAULT_DB_URL = "mongodb://127.0.0.1:27017/socialize";
    this.DEFAULT_PORT = 4000;

    this.DB_URL = process.env.DB_URL || this.DEFAULT_DB_URL;
    this.PORT = process.env.PORT || this.DEFAULT_PORT;
    this.JWT_TOKEN = process.env.JWT_TOKEN || "1d53wa11dwa";
    this.NODE_ENV = process.env.NODE_ENV || "development";
    this.SECRET_KEY_FIRST = process.env.SECRET_KEY_FIRST || "dwafawfwa";
    this.SECRET_KEY_SECOND = process.env.SECRET_KEY_SECOND || "vzdcdbvdsfdsadf";
    this.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
    this.REDIS_HOST = process.env.REDIS_HOST || "redis://localhost:6379";
    this.CLOUD_NAME = process.env.CLOUD_NAME || "edafasdf";
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "3223322";
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || "wadwadwdadwdwa";
  }

  createLogger(name) {
    return bunyan.createLogger({ name, level: "debug" });
  }

  validateConfig() {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`${key} is undefined`);
      }
    }
  }

  cloudinaryConfig() {
    cloudinary.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET,
    });
  }
}

const config = new Config();
module.exports = { config };
