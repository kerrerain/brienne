const process = require("process");
const puppeteer = require("puppeteer");
const errors = require("../errors");
const scraper = require("../scraper");
const tests = require("../tests");

const BRIENNE_OUTPUT = process.env.BRIENNE_OUTPUT || "elastic";
const output = require(`../outputs/${BRIENNE_OUTPUT}`);

async function _processWebsite(website) {
  console.log("Processing website: ", website.url);

  const browser = await puppeteer
    .launch()
    .catch(errors.commonErrorHandler);


  const results = await scraper
    .explorePage(browser, website.url)
    .catch(errors.commonErrorHandler);

  output.publish(tests.of(results));

  await browser
    .close()
    .catch(errors.commonErrorHandler);
}

async function run(websites) {
  for (website of websites) {
    _processWebsite(website)
      .catch(errors.commonErrorHandler);
  }
}

module.exports = {
  run
};