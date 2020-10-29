const puppeteer = require("puppeteer");
const input = require("./input");
const tests = require("./tests");
const output = require("./outputs/elastic");

async function _checkA11Y(page, checklist) {
  if (await tests.pageHasTerm(page, "W3C")) {
    checklist.check("A11Y_5");
  }

  if (await tests.pageHasTerm(page, "W3C")) {
    checklist.check("A11Y_6");
  }

  if (!await tests.pageHasTerm(page, "accessibilite")) {
    return;
  }

  checklist.check("A11Y_1");
}

async function _processWebsite(website) {
  console.log("Processing website: ", website.url);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(website.url);

  const checklist = new tests.Checklist(website.url);

  await _checkA11Y(page, checklist);

  output.publish(checklist.toArray());

  await browser.close();
}

async function run() {
  input
    .fetchWebsites()
    .forEach(_processWebsite);
}

run();