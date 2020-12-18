const { of, TEST_VALID, CLICKABLE_TERMS } = require("../src/tests");
const checklistFactory = require("../src/checklist");
const assert = require("assert");

describe("The 'of' function", () => {
  CLICKABLE_TERMS.forEach(n => {
    it(`should check that the ${n.code} term is clickable.`, () => {
      // Given a checklist
      const checklist = checklistFactory.create("https://homepage.com");

      // And a term of the checklist that links to subpages
      checklist.terms[n.code].links = [
        "https://subpage.com"
      ];

      // When testing this checklist
      const actual = of(checklist);

      // Then the result of the clickable test should be valid
      assert.strictEqual(actual[n.tests.clickable].result, TEST_VALID);
    });
  });
});