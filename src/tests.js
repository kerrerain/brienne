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

function of(results) {
  const testsMap = {};

  TESTS.forEach(n => {
    testsMap[n.code] = {
      baseURL: results.url,
      currentURL: results.url,
      test: n,
      result: TEST_INVALID, // Until it has been checked, it's considered invalid.
      status: "success",
      metadata: {}
    };
  });

  if (results.hasTermA11Y) {
    testsMap["A11Y_1"].result = TEST_VALID;
  }

  if (results.hasClickableA11Y) {
    testsMap["A11Y_2"].result = TEST_VALID;

    if(results.subpages.length > 0 && results.subpages[0].reachable) {
      const subpage = results.subpages[0];

      testsMap["A11Y_3"].result = TEST_VALID;
      testsMap["A11Y_3"].currentURL = subpage.url;
      
      if (subpage.hasTermRGAA) {
        testsMap["RGAA_4"].result = TEST_VALID;
        testsMap["RGAA_4"].currentURL = subpage.url;
      }

      if (subpage.hasClickableRGAA) {
        testsMap["RGAA_5"].result = TEST_VALID;
        testsMap["RGAA_5"].currentURL = subpage.url;
      }
    }
  }

  if (results.hasTermRGAA) {
    testsMap["RGAA_1"].result = TEST_VALID;
  }

  if (results.hasClickableRGAA) {
    testsMap["RGAA_2"].result = TEST_VALID;

    if(results.subpages.length > 0 && results.subpages[0].reachable) {
      testsMap["RGAA_3"].result = TEST_VALID;
    }
  }

  

  results.subpages.forEach(n => {

  });

  return Object.values(testsMap);
}

module.exports = {
  of
};