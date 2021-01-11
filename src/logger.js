const { createLogger, format, transports } = require('winston');

const {
  combine,
  padLevels,
  colorize,
  timestamp,
  printf,
} = format;

const BRIENNE_LOGGER_LEVEL = process.env.BRIENNE_LOGGER_LEVEL || 'info';

function init() {
  /* eslint no-shadow: "off" */
  /*
    It seems that winston's printf requires the timestamp
    parameter to have this exact name. It shadows the timestamp
    function, which is why eslint complains. I've checked that
    the logger works well with this exception.

    h.bonjour@groupeonepoint.com
  */
  const customFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level} ${message}`);

  const logger = createLogger({
    level: BRIENNE_LOGGER_LEVEL,
    format: combine(
      colorize(),
      timestamp(),
      padLevels(),
      customFormat,
    ),
    transports: [new transports.Console()],
  });

  return logger;
}

module.exports = init();
