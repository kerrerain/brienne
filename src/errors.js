const process = require("process");

function commonErrorHandler(e) {
    console.log(e);
    process.exit(1);
}

module.exports = {
    commonErrorHandler
}