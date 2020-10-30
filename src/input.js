const fs = require("fs");
const path = require("path");
const process = require("process");

const BRIENNE_INPUT_FILE = process.env.BRIENNE_INPUT_FILE || path.join("example", "default.json");

/**
 * Fetches a list of websites to analyze from a single file.
 */
function fetchWebsites() {
    websitesMap = {};

    const websites = JSON.parse(fs.readFileSync(BRIENNE_INPUT_FILE));

    websites.forEach(n => {
        websitesMap[n.metadata.url] = {
            url: n.metadata.url
        };
    });

    return Object.values(websitesMap);
}

module.exports = {
    fetchWebsites
};