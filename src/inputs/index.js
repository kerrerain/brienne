const INPUT_FILE = require('./file');
const INPUT_URL = require('./url');

const BRIENNE_INPUT = process.env.BRIENNE_INPUT || 'url';
const INPUTS = {
  file: INPUT_FILE,
  url: INPUT_URL,
};

async function getWebsitesCursor() {
  return INPUTS[BRIENNE_INPUT].getWebsitesCursor();
}

module.exports = {
  getWebsitesCursor,
};
