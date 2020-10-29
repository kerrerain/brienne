const fs = require("fs");
const path = require("path");
const process = require("process");

const BRIENNE_INPUT_FILE = process.env.BRIENNE_INPUT_FILE || path.join("example", "default.json");

/**
 * Fetches a list of websites to analyze from a single file.
 */
function fetchWebsites() {
    return JSON.parse(fs.readFileSync(BRIENNE_INPUT_FILE));
}

module.exports = {
    fetchWebsites
};