const process = require("process");
const logger = require("./logger");

function commonErrorHandler(e) {
    logger.error(e.stack);
    process.exit(1);
}

module.exports = {
    commonErrorHandler
}