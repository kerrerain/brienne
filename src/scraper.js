const errors = require("./errors");

async function explorePage(browser, url) {
  console.log("Checking page: ", url);

  const checklist = {
    url: url,
    reachable: false,
    hasTermW3C: false,
    hasTermWCAG: false,
    hasTermA11Y: false,
    hasTermRGAA: false,
    hasClickableA11Y: false,
    hasClickableRGAA: false,
    subpages: []
  };

  const page = await browser
    .newPage()
    .catch(errors.commonErrorHandler);

  const response = await page
    .goto(website.url)
    .catch(errors.commonErrorHandler);

  // If the page isn't reachable, it's useless to go further.
  if (response.status() != 200) {
    return checklist;
  }

  checklist.reachable = true;

  const [hasTermW3C, hasTermWCAG, hasTermA11Y, hasTermRGAA] = await Promise.all([
    _hasTerm(page, "W3C"),
    _hasTerm(page, "WCAG"),
    _hasTerm(page, "accessibilite"),
    _hasTerm(page, "declaration de conformite"),
  ]).catch(errors.commonErrorHandler);

  checklist.hasTermW3C = hasTermW3C;
  checklist.hasTermWCAG = hasTermWCAG;
  checklist.hasTermA11Y = hasTermA11Y;
  checklist.hasTermRGAA = hasTermRGAA;

  // If there isn't any A11Y or RGAA term, there is nothing more to scrap.
  if (!hasTermA11Y && !hasTermRGAA) {
    return checklist;
  }

  const [clickableA11Y, clickableRGAA] = await Promise.all([
    _clickableElements(page, "accessibilite"),
    _clickableElements(page, "declaration de conformite"),
  ]);

  checklist.hasClickableA11Y = clickableA11Y.length > 0;
  checklist.hasClickableRGAA = clickableRGAA.length > 0;

  for (element of clickableA11Y.concat(clickableRGAA)) {
    // Avoid an infinite loop :P
    if (element.url === url) {
      continue;
    }

    const subpage = await explorePage(browser, element.url)
      .catch(errors.commonErrorHandler);

    checklist.subpages.push(subpage);
  }

  return checklist;
}

/**
 * Searches a term on a page.
 * 
 * @param {object} page The puppeteer page.
 * @param {string} term The term to search for.
 */
async function _hasTerm(page, term) {
  const content = (await page.content()).replace(/é/g, "e"); // We only need to remove "é".
  const found = content.match(new RegExp(`\\b(${term})\\b`, "gmi"));
  return found != null && found.length > 0;
}

/**
 * Searches for clickable elements with this term on a page.
 * If no element has been found, returns an empty array.
 * 
 * @param {object} page The puppeteer page.
 * @param {string} term The term to search for.
 */
async function _clickableElements(page, term) {
  const regex = new RegExp(`\\b(${term})\\b`, "gmi");
  const elements = await page.$$eval("a", nodes => nodes.map(n => {
    return {
      url: n.href,
      text: n.innerText
    }
  }));

  return elements.filter(n => {
    const found = n.text.replace(/é/g, "e").match(regex);
    return found != null && found.length > 0;
  });
}

module.exports = {
  explorePage
};