const bunyan = require("bunyan");

const logger = () => {
  // Create Bunyan logger instance
  const createLogger = (name) => {
    return bunyan.createLogger({ name, level: "debug" });
  };

  return {
    createLogger,
  };
};

module.exports = logger();
