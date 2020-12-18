const { URL } = require("url");
const process = require("process");
const cheerio = require("cheerio");
const cache = require("./cache");
const errors = require("./errors");
const logger = require("./logger");
const checklistFactory = require("./checklist");
const BRIENNE_NO_CACHE = process.env.BRIENNE_NO_CACHE || "0";
const MODULE_NAME = "[scraper]";

async function explorePage(page, url, depth) {
  if (!depth) {
    depth = 0;
  }

  logger.debug(`${MODULE_NAME} ${url} Starting.`);

  const checklist = checklistFactory.create(url);

  const report = await _reachURL(page, url);

  // If the page content couldn't be found,
  // an error may have occured. It's useless to go further.
  if (report.content === "") {
    checklist.errors.push(...report.errors);
    return checklist;
  }

  checklist.reachable = true;

  logger.debug(`${MODULE_NAME} ${url} Searching terms.`);

  for (key in checklist.terms) {
    checklist.terms[key].exists = checklist.terms[key].regex.every(n => {
      return n.test(report.content);
    });
  }

  // If there isn't any A11Y or RGAA term, there is nothing more to scrap.
  if (!checklist.terms["A11Y_1"].exists && !checklist.terms["RGAA_1"].exists) {
    logger.debug(`${MODULE_NAME} ${url} Finished. Not any AY11 or RGAA term found.`);
    return checklist;
  }

  logger.debug(`${MODULE_NAME} ${url} Searching clickable terms.`);

  const $ = cheerio.load(report.content);
  const allClickableElements = [];

  for (key in ["A11Y_1", "RGAA_1"]) {
    const termClickableElements = _clickableElements($, checklist.terms[key].regex);
    checklist.terms[key].clickable = termClickableElements.length > 0;
    // checklist.terms[key].clickableURLs = 
    allClickableElements = allClickableElements.concat(termClickableElements);
  }

  for (element of allClickableElements) {
    const subpageURL = new URL(element.url, url).href;

    // Avoid an infinite loop :P
    if (subpageURL === url || depth >= 2) {
      continue;
    }

    const subpage = await explorePage(page, subpageURL, depth + 1)
      .catch(errors.commonErrorHandler);

    checklist.subpages.push(subpage);
  }

  logger.debug(`${MODULE_NAME} ${url} Finished.`);

  return checklist;
}

async function _reachURL(page, url) {
  const report = {
    content: cache.getURLContent(url),
    errors: []
  };

  // The content is loaded from cache if possible,
  // because the rendering of the page can be very slow.
  if (report.content !== "" && BRIENNE_NO_CACHE !== "1") {
    return report;
  }

  const response = await page
    .goto(url, {
      waitUntil: "networkidle2" // More forgiving option for websites that download many files.
    })
    .catch(error => {
      message = `Error while processing ${url}: ${error}`;
      report.errors.push(message);
      logger.error(message);
    });

  // If the page isn't reachable because of an error,
  // it's useless to go further.
  if (!response || response.status() !== 200) {
    return report;
  }

  // Avoid error with redirections.
  // https://github.com/puppeteer/puppeteer/issues/3323
  //
  await page.waitForSelector("html");

  report.content = await page
    .content()
    .catch(errors.commonErrorHandler);

  cache.putURLContent(url, report.content);

  return report
}

/**
 * Searches for clickable elements with this term on a page.
 * If no element has been found, returns an empty array.
 * 
 * @param {object} $ The Cheerio instance.
 * @param {array[RegExp]} regex The list of regex to use.
 */
function _clickableElements($, regex) {
  const elements = $("a").map((_, element) => {
    return {
      text: $(element).text(),
      url: $(element).attr("href")
    }
  }).get();

  return elements.filter(n => {
    return regex.every(r => {
      return r.test(n.text);
    });
  });
}

module.exports = {
  explorePage
};