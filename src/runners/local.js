const process = require("process");
const puppeteer = require("puppeteer");
const marky = require("marky");
const errors = require("../errors");
const scraper = require("../scraper");
const tests = require("../tests");
const logger = require("../logger");

const MODULE_NAME = "[runners.local]";
const BRIENNE_WORKERS = Number(process.env.BRIENNE_WORKERS || "4");
const BRIENNE_PAGE_TIMEOUT = Number(process.env.BRIENNE_PAGE_TIMEOUT || "10000");
const BRIENNE_OUTPUT = process.env.BRIENNE_OUTPUT || "elastic";
const output = require(`../outputs/${BRIENNE_OUTPUT}`);

async function run(cursor) {
  marky.mark(MODULE_NAME);
  logger.info(`${MODULE_NAME} Starting local runner with ${BRIENNE_WORKERS} workers.`);

  const browser = await puppeteer
    .launch()
    .catch(errors.commonErrorHandler);

  const promises = []

  for (let i = 0; i < BRIENNE_WORKERS; i++) {
    promises.push(_processCursor(browser, cursor));
  }

  await Promise.all(promises);

  await browser
    .close()
    .catch(errors.commonErrorHandler);

  const result = marky.stop(MODULE_NAME);
  logger.info(`${MODULE_NAME} Stopped local runner. Took ${Math.floor(result.duration)} ms.`);
}

async function _processCursor(browser, cursor) {
  while (cursor.hasNext()) {
    const nextWebsite = cursor.next();
    const page = await browser
      .newPage()
      .catch(errors.commonErrorHandler);
    page.setDefaultTimeout(BRIENNE_PAGE_TIMEOUT);

    await _processWebsite(page, nextWebsite)
      .catch(errors.commonErrorHandler);

    await page.close();
  }
}

async function _processWebsite(page, website) {
  marky.mark(website.url);

  logger.info(`${MODULE_NAME} Processing website ${website.url}`);

  const results = await scraper
    .explorePage(page, website.url)
    .catch(errors.commonErrorHandler);

  output.publish(Object.values(tests.of(results)));

  logger.info(`${MODULE_NAME} Published results for website ${website.url}`);

  const result = marky.stop(website.url);
  logger.info(`${MODULE_NAME} Took ${Math.floor(result.duration)} ms for ${website.url}`);
}

module.exports = {
  run
};