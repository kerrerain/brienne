const { createLogger, format, transports } = require('winston');
const { combine, padLevels, colorize, timestamp, printf } = format;
const BRIENNE_LOGGER_LEVEL = process.env.BRIENNE_LOGGER_LEVEL || "info";

function init() {
  const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level} ${message}`;
  });

  const logger = createLogger({
    level: BRIENNE_LOGGER_LEVEL,
    format: combine(
      colorize(),
      timestamp(),
      padLevels(),
      customFormat
    ),
    transports: [new transports.Console()]
  });

  return logger;
}

module.exports = init();