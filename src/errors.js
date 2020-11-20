const process = require("process");
const logger = require("./logger");

function commonErrorHandler(e) {
    logger.error(e);
    process.exit(1);
}

module.exports = {
    commonErrorHandler
}