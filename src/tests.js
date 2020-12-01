const TEST_VALID = "C";
const TEST_INVALID = "NC";
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
  }
]

function of(results) {
  const testsMap = {};
  const now = new Date().toISOString();

  TESTS.forEach(n => {
    testsMap[n.code] = {
      baseURL: results.url,
      currentURL: results.url,
      test: n,
      result: TEST_INVALID, // Until it has been checked, it's considered invalid.
      status: "success",
      date: now,
      metadata: {},
      errors: []
    };
  });

  const criteria = {
    "A11Y_0": "reachable",
    "A11Y_1": "hasTermA11Y",
    "A11Y_2": "hasClickableA11Y",
    "A11Y_5": "hasTermW3C",
    "A11Y_6": "hasTermWCAG",
    "RGAA_1": "hasTermRGAA",
    "RGAA_2": "hasClickableRGAA"
  };
  Object.keys(criteria).forEach(code => {
    if (results[criteria[code]]) {
      testsMap[code].result = TEST_VALID;
    }
  });

  if (!results.reachable) {
    testsMap["A11Y_0"].errors = results.errors;
  }

  if (results.subpages &&
    results.subpages.length > 0) {
    const subpage = results.subpages[0];

    ["A11Y_3", "RGAA_3", "RGAA_4", "RGAA_5"].forEach(code => {
      testsMap[code].currentURL = subpage.url;
    });

    if (results.hasClickableA11Y &&
      subpage.reachable) {
      testsMap["A11Y_3"].result = TEST_VALID;
    }

    if (results.hasClickableRGAA &&
      subpage.reachable) {
      testsMap["RGAA_3"].result = TEST_VALID;
    }

    ["A11Y_3", "RGAA_3"].forEach(code => {
      testsMap[code].errors = subpage.errors;
    });

    if (subpage.hasTermA11Y || subpage.hasTermRGAA) {
      testsMap["RGAA_4"].result = TEST_VALID;
    }

    if (subpage.hasClickableA11Y || subpage.hasClickableRGAA) {
      testsMap["RGAA_5"].result = TEST_VALID;
    }

    if (subpage.subpages &&
      subpage.subpages.length > 0) {

      const subsubpage = subpage.subpages[0];

      testsMap["RGAA_6"].currentURL = subsubpage.url;
      testsMap["RGAA_6"].errors = subsubpage.errors;

      if (subsubpage.reachable) {
        testsMap["RGAA_6"].result = TEST_VALID;
      }
    }
  }

  // if (results.hasClickableA11Y) {
  //   testsMap["A11Y_2"].result = TEST_VALID;

  //   if (results.subpages.length > 0 && results.subpages[0].reachable) {
  //     const subpage = results.subpages[0];

  //     testsMap["A11Y_3"].result = TEST_VALID;
  //     testsMap["A11Y_3"].currentURL = subpage.url;
  //     testsMap["RGAA_4"].currentURL = subpage.url;
  //     testsMap["RGAA_5"].currentURL = subpage.url;

  //     if (subpage.hasTermRGAA) {
  //       testsMap["RGAA_4"].result = TEST_VALID;
  //     }

  //     if (subpage.hasClickableRGAA) {
  //       testsMap["RGAA_5"].result = TEST_VALID;
  //     }
  //   }
  // }

  // if (results.hasClickableRGAA) {
  //   testsMap["RGAA_2"].result = TEST_VALID;

  //   if (results.subpages.length > 0 && results.subpages[0].reachable) {
  //     const subpage = results.subpages[0];

  //     testsMap["RGAA_3"].result = TEST_VALID;
  //     testsMap["RGAA_3"].currentURL = subpage.url;
  //     testsMap["RGAA_4"].currentURL = subpage.url;
  //     testsMap["RGAA_5"].currentURL = subpage.url;

  //     if (subpage.hasTermRGAA) {
  //       testsMap["RGAA_4"].result = TEST_VALID;
  //     }

  //     if (subpage.hasClickableRGAA) {
  //       if (results.subpages[0].subpages.length > 0 && results.subpages[0].subpages[0].reachable) {
  //         testsMap["RGAA_6"].result = TEST_VALID;
  //         testsMap["RGAA_6"].currentURL = results.subpages[0].subpages[0].url;
  //       }
  //     }
  //   }
  // }

  return testsMap;
}

module.exports = {
  of,
  TEST_VALID,
  TEST_INVALID
};