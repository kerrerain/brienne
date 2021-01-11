const axios = require('axios');
const marky = require('marky');
const process = require('process');
const { Cursor } = require('./cursor');
const logger = require('../logger');

const MODULE_NAME = '[inputs.url]';
const BRIENNE_INPUT_URL = process.env.BRIENNE_INPUT_URL || 'https://raw.githubusercontent.com/ahmedalami/annuaire-administration/master/data/json/flat.json';

/**
 * Fetches a list of websites to analyze from an URL.
 */
async function _fetchWebsites() {
  const websitesMap = {};

  marky.mark(MODULE_NAME);
  logger.info(`${MODULE_NAME} Fetching websites from ${BRIENNE_INPUT_URL}`);

  const response = await axios.get(BRIENNE_INPUT_URL, {
    responseType: 'text',
  });

  response.data.forEach((n) => {
    if (n.url !== '') {
      websitesMap[n.url] = {
        url: n.url,
      };
    }
  });

  const result = marky.stop(MODULE_NAME);
  logger.info(`${MODULE_NAME} Found ${Object.keys(websitesMap).length} valid websites to process. It took ${Math.floor(result.duration)} ms.`);

  return Object.values(websitesMap);
}

async function getWebsitesCursor() {
  const websites = await _fetchWebsites();
  return new Cursor(websites);
}

module.exports = {
  getWebsitesCursor,
};
