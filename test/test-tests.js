const { of, TEST_VALID, TEST_INVALID } = require("../src/tests");
const assert = require("assert");

describe("The 'of' function", () => {
  const testCasesInvalidByDefault = [
    "A11Y_0",
    "A11Y_1",
    "A11Y_2",
    "A11Y_3",
    "A11Y_4",
    "A11Y_5",
    "A11Y_6",
    "RGAA_1",
    "RGAA_2",
    "RGAA_3",
    "RGAA_4",
    "RGAA_5",
    "RGAA_6",
    "RGAA_7_1",
    "RGAA_7_2",
    "RGAA_7_3"
  ];
  testCasesInvalidByDefault.forEach(n => {
    it(`should set test ${n} to ${TEST_INVALID} by default.`, () => {
      // Given
      const checklist = {};

      // When
      const actual = of(checklist);

      // Then
      assert.strictEqual(actual[n].result, TEST_INVALID);
    });
  });

  const checkTestPropertyMap = {
    "A11Y_0": "reachable",
    "A11Y_1": "hasTermA11Y",
    "A11Y_2": "hasClickableA11Y",
    "A11Y_5": "hasTermW3C",
    "A11Y_6": "hasTermWCAG",
    "RGAA_1": "hasTermRGAA",
    "RGAA_2": "hasClickableRGAA"
  };

  Object.keys(checkTestPropertyMap).forEach(code => {
    const property = checkTestPropertyMap[code];

    it(`should check test ${code} === ${TEST_VALID} if ${property}.`, () => {
      // Given
      const checklist = {}
      checklist[property] = true;

      // When
      const actual = of(checklist);

      // Then
      assert.strictEqual(actual[code].result, TEST_VALID);
    });
  });

  const testCasesSubpage = [
    {
      clickable: true,
      subpages: [{ reachable: true }],
      expected: TEST_VALID
    },
    {
      clickable: false,
      subpages: [{ reachable: true }],
      expected: TEST_INVALID
    },
    {
      hasClickableA11Y: true,
      subpages: [{ reachable: false }],
      expected: TEST_INVALID
    },
    {
      hasClickableA11Y: true,
      subpages: [],
      expected: TEST_INVALID
    }
  ];

  testCasesSubpage.forEach(n => {
    it(`should check A11Y_3 === ${n.expected} for ${JSON.stringify(n)}.`, () => {
      // Given
      const checklist = {
        hasClickableA11Y: n.clickable,
        subpages: n.subpages
      };

      // When
      const actual = of(checklist);

      // Then
      assert.strictEqual(actual["A11Y_3"].result, n.expected);
    });
  });

  testCasesSubpage.forEach(n => {
    it(`should check RGAA_3 === ${n.expected} for ${JSON.stringify(n)}.`, () => {
      // Given
      const checklist = {
        hasClickableRGAA: n.clickable,
        subpages: n.subpages
      };

      // When
      const actual = of(checklist);

      // Then
      assert.strictEqual(actual["RGAA_3"].result, n.expected);
    });
  });

  const testCasesSubpageURL = [
    "A11Y_3",
    "RGAA_3",
    "RGAA_4",
    "RGAA_5"
  ];
  testCasesSubpageURL.forEach(n => {
    it(`should set the subpage's url for ${n}.`, () => {
      // Given
      const checklist = {
        url: "homepage",
        subpages: [{ url: "subpage" }]
      };

      // When
      const actual = of(checklist);

      // Then
      assert.deepStrictEqual(
        {
          baseURL: actual[n].baseURL,
          currentURL: actual[n].currentURL
        },
        {
          baseURL: "homepage",
          currentURL: "subpage"
        }
      );
    });
  });


  it("should set the subpage's url for RGAA.", () => {
    // Given
    const checklist = {
      url: "homepage",
      hasClickableRGAA: true,
      subpages: [{ url: "subpage" }]
    };

    // When
    const actual = of(checklist);

    // Then
    assert.deepStrictEqual(
      {
        baseURL: actual["RGAA_3"].baseURL,
        currentURL: actual["RGAA_3"].currentURL
      },
      {
        baseURL: "homepage",
        currentURL: "subpage"
      }
    );
  });

  it("should provide the errors from the homepage.", () => {
    // Given
    const checklist = {
      errors: ["Test"]
    };

    // When
    const actual = of(checklist);

    // Then
    assert.strictEqual(actual["A11Y_0"].errors, checklist.errors);
  });

  const testCasesSubpageErrors = [
    "A11Y_3",
    "RGAA_3"
  ];
  testCasesSubpageErrors.forEach(n => {
    it(`should provide the errors from the subpage for ${n}.`, () => {
      // Given
      const checklist = {
        subpages: [
          { errors: ["Test"] }
        ]
      };

      // When
      const actual = of(checklist);

      // Then
      assert.strictEqual(actual[n].errors, checklist.subpages[0].errors);
    });
  });

  const checkTestSubpagePropertyMap = {
    "RGAA_4": ["hasTermRGAA", "hasTermA11Y"],
    "RGAA_5": ["hasClickableRGAA", "hasClickableA11Y"]
  };

  Object.keys(checkTestSubpagePropertyMap).forEach(code => {
    checkTestSubpagePropertyMap[code].forEach(property => {
      it(`should check test ${code} === ${TEST_VALID} if ${property}.`, () => {
        // Given
        const subpage = {};
        subpage[property] = true;

        const checklist = {
          subpages: [subpage]
        };

        // When
        const actual = of(checklist);

        // Then
        assert.strictEqual(actual[code].result, TEST_VALID);
      });
    });
  });

  it("should check RGAA_6", () => {
    // Given
    const checklist = {
      url: "homepage",
      hasClickableRGAA: true,
      subpages: [{
        url: "subpage",
        reachable: true,
        subpages: [{
          url: "sub-subpage",
          reachable: true,
          errors: ["test"]
        }],
      }]
    };

    // When
    const actual = of(checklist);

    // Then
    assert.deepStrictEqual(
      {
        currentURL: actual["RGAA_6"].currentURL,
        result: actual["RGAA_6"].result,
        errors: actual["RGAA_6"].errors
      },
      {
        currentURL: "sub-subpage",
        result: TEST_VALID,
        errors: ["test"]
      });
  });
});