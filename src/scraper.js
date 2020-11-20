const errors = require("./errors");
const logger = require("./logger");
const MODULE_NAME = "[scraper]";

const REGEX_W3C = new RegExp("W3C", "mi");
const REGEX_WCAG = new RegExp("WCAG", "mi");
const REGEX_A11Y = new RegExp("accessibilité", "mi");
const REGEX_RGAA = new RegExp("déclaration de conformité", "mi");

async function explorePage(page, url) {
  logger.debug(`${MODULE_NAME} ${url} Starting.`);

  const checklist = {
    url: url,
    reachable: false,
    hasTermW3C: false,
    hasTermWCAG: false,
    hasTermA11Y: false,
    hasTermRGAA: false,
    hasClickableA11Y: false,
    hasClickableRGAA: false,
    subpages: [],
    errors: []
  };

  const response = await page
    .goto(website.url)
    .catch(error => {
      message = `Error while processing ${url}: ${error}`;
      checklist.errors.push({
        "message": message
      });
      logger.error(message);
    });

  // If the page isn't reachable, it's useless to go further.
  if (!response || response.status() != 200) {
    logger.debug(`${MODULE_NAME} ${url} Unreachable.`);
    return checklist;
  }

  checklist.reachable = true;

  logger.debug(`${MODULE_NAME} ${url} Searching terms.`);

  const pageContent = await page
    .content()
    .catch(errors.commonErrorHandler);

  checklist.hasTermW3C = REGEX_W3C.test(pageContent);
  checklist.hasTermWCAG = REGEX_WCAG.test(pageContent);
  checklist.hasTermA11Y = REGEX_A11Y.test(pageContent);
  checklist.hasTermRGAA = REGEX_RGAA.test(pageContent);

  // If there isn't any A11Y or RGAA term, there is nothing more to scrap.
  if (!checklist.hasTermA11Y && !checklist.hasTermRGAA) {
    logger.debug(`${MODULE_NAME} ${url} Finished. Not any AY11 or RGAA term found.`);
    return checklist;
  }

  const [clickableA11Y, clickableRGAA] = await Promise.all([
    _clickableElements(page, REGEX_A11Y),
    _clickableElements(page, REGEX_RGAA),
  ]);

  checklist.hasClickableA11Y = clickableA11Y.length > 0;
  checklist.hasClickableRGAA = clickableRGAA.length > 0;

  for (element of clickableA11Y.concat(clickableRGAA)) {
    // Avoid an infinite loop :P
    if (element.url === url) {
      continue;
    }

    const subpage = await explorePage(page, element.url)
      .catch(errors.commonErrorHandler);

    checklist.subpages.push(subpage);
  }

  logger.debug(`${MODULE_NAME} ${url} Finished.`);

  return checklist;
}

/**
 * Searches for clickable elements with this term on a page.
 * If no element has been found, returns an empty array.
 * 
 * @param {object} page The puppeteer page.
 * @param {RegExp} regex The regex to use.
 */
async function _clickableElements(page, regex) {
  const elements = await page.$$eval("a", nodes => nodes.map(n => {
    return {
      url: n.href,
      text: n.innerText
    }
  }));

  return elements.filter(n => {
    return regex.test(n.text);
  });
}

module.exports = {
  explorePage
};