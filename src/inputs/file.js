const fs = require("fs");
const path = require("path");
const process = require("process");
const { Cursor } = require("./cursor");
const logger = require("../logger");

const MODULE_NAME = "[inputs.file]";
const BRIENNE_INPUT_FILE = process.env.BRIENNE_INPUT_FILE || path.join("example", "default.json");

/**
 * Fetches a list of websites to analyze from a single file.
 */
function _fetchWebsites() {
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

async function getWebsitesCursor() {
    return new Cursor(_fetchWebsites());
}

module.exports = {
    getWebsitesCursor
};