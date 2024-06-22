const mongoose = require("mongoose");
const { createLogger } = require("./shared/globals/logger");

const log = createLogger("database");

const MyDatabase = () => {
  const connect = () => {
    mongoose
      .connect(process.env.DB_URL, {})
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
