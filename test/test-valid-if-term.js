const { of, TEST_VALID } = require("../src/tests");
const checklistFactory = require("../src/checklist");
const assert = require("assert");

describe("The 'of' function", () => {
  [
    "A11Y_1",
    "A11Y_4",
    "A11Y_5",
    "A11Y_6",
    "RGAA_1",
    "RGAA_7_1",
    "RGAA_7_2",
    "RGAA_7_3",
    "RGAA_8",
    "RGAA_9",
    "RGAA_10"
  ].forEach(n => {
    it(`should set test ${n} to ${TEST_VALID} if the matching term is found.`, () => {
      // Given the code of a test
      const code = n;

      // And a checklist
      const checklist = checklistFactory.create("https://homepage.com");

      // And the matching term of this test has been found
      checklist.terms[code].exists = true;

      // When testing this checklist
      const actual = of(checklist);

      // Then the result for this test should be valid
      assert.strictEqual(actual[code].result, TEST_VALID);
    });
  });

  it(`should set the test RGAA_1 to ${TEST_VALID} if the matching term is found in a subpage.`, () => {
    // Given the code of a test
    const code = "RGAA_1";

    // And a checklist with a subpage
    const checklist = checklistFactory.create("https://homepage.com");
    const subpageChecklist = checklistFactory.create("https://subpage.com");
    checklist.subpages.push(subpageChecklist);

    // And the matching term of this test has been found in the subpage
    subpageChecklist.terms[code].exists = true;

    // When testing this checklist
    const actual = of(checklist);

    // Then the result for this test should be valid
    assert.strictEqual(actual[code].result, TEST_VALID);

    // And the current url of the test is the url of the subpage
    assert.strictEqual(actual[code].currentURL, subpageChecklist.url);
  });
});