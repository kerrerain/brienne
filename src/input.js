const fs = require("fs");
const path = require("path");
const process = require("process");
const logger = require("./logger");

const MODULE_NAME = "[input]";
const BRIENNE_INPUT_FILE = process.env.BRIENNE_INPUT_FILE || path.join("example", "default.json");

/**
 * Fetches a list of websites to analyze from a single file.
 */
function fetchWebsites() {
    websitesMap = {};

    const websites = JSON.parse(fs.readFileSync(BRIENNE_INPUT_FILE));

    websites.forEach(n => {
        if (n.metadata.url !== "") {
            websitesMap[n.metadata.url] = {
                url: n.metadata.url
            };
        }
    });

    logger.info(`${MODULE_NAME} Found ${Object.keys(websitesMap).length} valid websites to process.`);

    return Object.values(websitesMap);
}

module.exports = {
    fetchWebsites
};