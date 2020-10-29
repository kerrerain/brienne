const TEST_VALID = "C";
const TEST_INVALID = "NC";

const TESTS = [
  {
    id: "1",
    code: "A11Y_1",
    topic: "A11Y",
    title: "The homepage mentions the 'Accessibilité' keyword."
  },
  {
    id: "2",
    code: "A11Y_2",
    topic: "A11Y",
    title: "The 'Accessibilité' keyword is part of a clickable element of the homepage."
  },
  {
    id: "3",
    code: "A11Y_3",
    topic: "A11Y",
    title: "The page referenced by the 'Accessibilité' clickable element of the homepage is reachable."
  },
  {
    id: "4",
    code: "RGAA_1",
    topic: "RGAA",
    title: "The homepage mentions the 'Déclaration de conformité' keywords."
  },
  {
    id: "5",
    code: "RGAA_2",
    topic: "RGAA",
    title: "The 'Déclaration de conformité' keyword is part of a clickable element of the homepage."
  },
  {
    id: "6",
    code: "RGAA_3",
    topic: "RGAA",
    title: "The page referenced by the 'Déclaration de conformité' clickable element of the homepage is reachable."
  },
  {
    id: "7",
    code: "RGAA_4",
    topic: "RGAA",
    title: "The page referenced by the 'Accessibility' clickable element mentions the 'Déclaration de conformité' keyword."
  },
  {
    id: "8",
    code: "RGAA_5",
    topic: "RGAA",
    title: "The page referenced by the 'Accessibility' clickable element has a 'Déclaration de conformité' link."
  },
  {
    id: "13",
    code: "A11Y_4",
    topic: "RGAA",
    title: "The homepage mentions a percentage of conformity."
  },
  {
    id: "14",
    code: "A11Y_5",
    topic: "RGAA",
    title: "The homepage mentions the 'W3C' keyword."
  },
  {
    id: "15",
    code: "A11Y_6",
    topic: "RGAA",
    title: "The homepage mentions the 'WCAG' keyword."
  }
]

class Checklist {
  constructor(websiteUrl) {
    const self = this;

    self._websiteUrl = websiteUrl;
    self._tests = {};

    TESTS.forEach((test) => {
      self._tests[test.code] = {
        "base-url": self._websiteUrl,
        "current-url": self._websiteUrl,
        test: test,
        result: TEST_INVALID, // Until it has been checked, it's considered invalid.
        status: "success",
        metadata: {}
      }
    });
  }

  check(code) {
    this._tests[code].result = TEST_VALID;
  }

  toArray() {
    return Object.values(this._tests);
  }

}

/**
 * Searches a term on a page.
 * 
 * @param {object} page The puppeteer page.
 * @param {string} term The term to search for.
 */
async function pageHasTerm(page, term) {
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
async function pageClickableElements(page, term) {
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
  Checklist,
  pageHasTerm,
  pageClickableElements
};