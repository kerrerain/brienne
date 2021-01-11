const { URL } = require('url');
const process = require('process');
const cheerio = require('cheerio');
const cache = require('./cache');
const errors = require('./errors');
const logger = require('./logger');
const checklistFactory = require('./checklist');

const BRIENNE_NO_CACHE = process.env.BRIENNE_NO_CACHE || '0';
const MODULE_NAME = '[scraper]';
const BODY_REGEX = /<body[^>]*>(.*?)<\/body>/;

async function _reachURL(page, url) {
  const report = {
    content: cache.getURLContent(url),
    errors: [],
  };

  // The content is loaded from cache if possible,
  // because the rendering of the page can be very slow.
  if (report.content !== '' && BRIENNE_NO_CACHE !== '1') {
    return report;
  }

  const response = await page
    .goto(url, {
      waitUntil: 'networkidle2', // More forgiving option for websites that download many files.
    })
    .catch((error) => {
      const message = `Error while processing ${url}: ${error}`;
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
  await page.waitForSelector('html');

  report.content = await page
    .content()
    .catch(errors.commonErrorHandler);

  cache.putURLContent(url, report.content);

  return report;
}

/**
 * Searches for clickable elements with this term on a page.
 * If no element has been found, returns an empty array.
 *
 * @param {object} $ The Cheerio instance.
 * @param {array[RegExp]} regex The list of regex to use.
 */
function _clickableElements($, regex) {
  const elements = $('a').map((_, element) => ({
    text: $(element).text(),
    url: $(element).attr('href'),
  })).get();

  return elements.filter((n) => regex.every((r) => r.test(n.text)));
}

/**
 * Explores a page given its URL.
 *
 * @param {*} page
 * @param {*} url
 * @param {*} depth
 */
async function explorePage(page, url, depth) {
  const currentDepth = depth || 0;

  logger.debug(`${MODULE_NAME} ${url} Starting.`);

  const checklist = checklistFactory.create(url);
  const report = await _reachURL(page, url);

  // If the page content couldn't be found,
  // an error may have occured. It's useless to go further.
  if (report.content === '') {
    checklist.errors.push(...report.errors);
    return checklist;
  }

  const bodyContentMatches = report.content.replace(/\n/g, '').match(BODY_REGEX);

  // If there is no content between in a <body> tag,
  // It's useless to go further.
  if (bodyContentMatches === null || bodyContentMatches.length < 2) {
    checklist.errors.push('No valid <body> tag on the webpage.');
    return checklist;
  }

  const bodyContent = bodyContentMatches[1];
  checklist.reachable = true;

  logger.debug(`${MODULE_NAME} ${url} Searching terms.`);

  Object.keys(checklist.terms).forEach((key) => {
    checklist.terms[key].exists = checklist.terms[key].regex.every((n) => n.test(bodyContent));
  });

  // If there isn't any A11Y or RGAA term, there is nothing more to scrap.
  if (!checklist.terms.A11Y_1.exists && !checklist.terms.RGAA_1.exists) {
    logger.debug(`${MODULE_NAME} ${url} Finished. Not any AY11 or RGAA term found.`);
    return checklist;
  }

  logger.debug(`${MODULE_NAME} ${url} Searching clickable terms.`);

  const $ = cheerio.load(bodyContent);
  let allClickableElements = [];

  ['A11Y_1', 'RGAA_1'].forEach((key) => {
    const termClickableElements = _clickableElements($, checklist.terms[key].regex);
    checklist.terms[key].links = termClickableElements.map((element) => (
      new URL(element.url, url).href));
    allClickableElements = allClickableElements.concat(termClickableElements);
  });

  for (let i = 0; i < allClickableElements.length; i++) {
    const subpageURL = new URL(allClickableElements[i].url, url).href;

    // Avoid an infinite loop :P
    if (subpageURL !== url && currentDepth < 2) {
      /* eslint no-await-in-loop: "off" */
      /*
        For now I don't have the time
        to deep dive into the right behavior
        for parallelization with this specific code.

        h.bonjour@groupeonepoint.com
      */
      const subpage = await explorePage(page, subpageURL, currentDepth + 1)
        .catch(errors.commonErrorHandler);

      checklist.subpages.push(subpage);
    }
  }

  logger.debug(`${MODULE_NAME} ${url} Finished.`);

  return checklist;
}

module.exports = {
  explorePage,
};
