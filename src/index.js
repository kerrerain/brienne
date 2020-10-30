const process = require("process");
const puppeteer = require("puppeteer");
const input = require("./input");
const tests = require("./tests");
const errors = require("./errors");

const BRIENNE_OUTPUT = process.env.BRIENNE_OUTPUT || "elastic";
const output = require(`./outputs/${BRIENNE_OUTPUT}`);

async function _checkA11Y(page, checklist) {
  const [hasW3C, hasWCAG, hasAccessibilite] = await Promise.all([
    tests.pageHasTerm(page, "W3C"),
    tests.pageHasTerm(page, "WCAG"),
    tests.pageHasTerm(page, "accessibilite")
  ]).catch(errors.commonErrorHandler);

  if (hasW3C) {
    checklist.check("A11Y_5");
  }

  if (hasWCAG) {
    checklist.check("A11Y_6");
  }

  // If this test doesn't pass, it's useless to run the next tests.
  if (hasAccessibilite) {
    return;
  }

  checklist.check("A11Y_1");

  const clickableA11YElements = await tests
    .pageClickableElements(page, "accessibilite");

  if (clickableA11YElements.length > 0) {
    checklist.check("A11Y_2");
  }

  for (element of clickableA11YElements) {
    console.log(element.url);

    const response = await page
      .goto(element.url)
      .catch(errors.commonErrorHandler);

    if (response.status() == 200) {
      checklist.check("A11Y_3", {
        "current-url": element.url
      });
    }
  };
}

async function _processWebsite(website) {
  console.log("Processing website: ", website.url);

  const browser = await puppeteer
    .launch()
    .catch(errors.commonErrorHandler);

  const page = await browser
    .newPage()
    .catch(errors.commonErrorHandler);

  await page
    .goto(website.url)
    .catch(errors.commonErrorHandler);

  const checklist = new tests.Checklist(website.url);

  await _checkA11Y(page, checklist);

  output.publish(checklist.toArray());

  await browser
    .close()
    .catch(errors.commonErrorHandler);
}

async function run() {
  for (website of input.fetchWebsites()) {
    _processWebsite(website)
      .catch(errors.commonErrorHandler);
  }
}

run();