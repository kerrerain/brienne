const TEST_VALID = "C";
const TEST_INVALID = "NC";
const CLICKABLE_TERMS = [
  {
    code: "A11Y_1",
    tests: {
      clickable: "A11Y_2",
      reachable: "A11Y_3"
    }
  },
  {
    code: "RGAA_1",
    tests: {
      clickable: "RGAA_2",
      reachable: "RGAA_3"
    }
  }
];
const TESTS = [
  {
    id: "0",
    code: "A11Y_0",
    topic: "A11Y",
    title: "The homepage is reachable."
  },
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
    id: "9",
    code: "RGAA_6",
    topic: "RGAA",
    title: "The page referenced by the 'Accessibility' clickable element is reachable."
  },
  {
    id: "10",
    code: "RGAA_7_1",
    topic: "RGAA",
    title: "The website has a RGAA V2 declaration of conformity."
  },
  {
    id: "11",
    code: "RGAA_7_2",
    topic: "RGAA",
    title: "The website has a RGAA V3 declaration of conformity."
  },
  {
    id: "12",
    code: "RGAA_7_3",
    topic: "RGAA",
    title: "The website has a RGAA V4 declaration of conformity."
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
  },
  {
    id: "16",
    code: "RGAA_8",
    topic: "RGAA",
    title: "The website mentions the 'page d\'aide' keyword."
  },
  {
    id: "17",
    code: "RGAA_9",
    topic: "RGAA",
    title: "The website mentions the 'schéma pluriannuel' keyword."
  },
  {
    id: "18",
    code: "RGAA_10",
    topic: "RGAA",
    title: "The website mentions the 'plan d\'actions' keyword."
  }
];

function of(checklist) {
  const testsMap = {};

  TESTS.forEach(n => {
    testsMap[n.code] = {
      baseURL: checklist.url,
      currentURL: checklist.url,
      test: n,
      result: TEST_INVALID, // Until it has been checked, it's considered invalid.
      status: "success",
      date: new Date().toISOString(),
      metadata: {},
      errors: []
    };
  });

  if (checklist.reachable) {
    testsMap["A11Y_0"].result = TEST_VALID;
  }

  if (!checklist.reachable) {
    testsMap["A11Y_0"].errors = checklist.errors;
  }

  _check_terms(checklist, testsMap);

  CLICKABLE_TERMS.forEach(n => {
    if (checklist.terms[n.code].links.length > 0) {
      testsMap[n.tests.clickable].result = TEST_VALID;
    }
    checklist.subpages.forEach(page => {
      if (checklist.terms[n.code].links.includes(page.url)) {
        if (page.reachable) {
          testsMap[n.tests.reachable].result = TEST_VALID;
        }
        testsMap[n.tests.reachable].currentURL = page.url;
        testsMap[n.tests.reachable].errors = page.errors;
      }
    });
  });

  return testsMap;
}


function _check_terms(page, testsMap) {
  Object.keys(page.terms).forEach(n => {
    if (page.terms[n].exists) {
      testsMap[n].result = TEST_VALID;
      testsMap[n].currentURL = page.url;
    }
  });
  page.subpages.forEach(n => {
    _check_terms(n, testsMap);
  });
}

module.exports = {
  of,
  TEST_VALID,
  TEST_INVALID,
  CLICKABLE_TERMS
};