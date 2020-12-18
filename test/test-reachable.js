const { of, TEST_VALID, CLICKABLE_TERMS } = require("../src/tests");
const checklistFactory = require("../src/checklist");
const assert = require("assert");

describe("The 'of' function", () => {
  it(`should check that the homepage is reachable.`, () => {
    // Given a checklist with a reachable URL
    const checklist = checklistFactory.create("https://homepage.com");
    checklist.reachable = true;

    // When testing this checklist
    const actual = of(checklist);

    // Then the result for test A11Y_0 should be valid
    assert.strictEqual(actual["A11Y_0"].result, TEST_VALID);
  });

  it("should provide the errors from the homepage.", () => {
    // Given a checklist with errors
    const checklist = checklistFactory.create("https://homepage.com");
    checklist.errors = ["Test"];

    // When testing this checklist
    const actual = of(checklist);

    // Then the errors should be copied to the A11Y_0 test
    assert.strictEqual(actual["A11Y_0"].errors, checklist.errors);
  });

  CLICKABLE_TERMS.forEach(n => {
    it(`should check that the subpage of the ${n.code} term is reachable.`, () => {
      // Given a reachable subpage
      const subpageChecklist = checklistFactory.create("https://subpage.com");
      subpageChecklist.reachable = true;

      // And a checklist containing the subpage
      const checklist = checklistFactory.create("https://homepage.com");
      checklist.subpages.push(subpageChecklist);

      // And a term of the checklist that links to the subpage
      checklist.terms[n.code].links = [
        "https://subpage.com"
      ];

      // When testing this checklist
      const actual = of(checklist);

      // Then the result of the reachable test should be valid
      assert.strictEqual(actual[n.tests.reachable].result, TEST_VALID);

      // And the current url of this test is the url of the subpage
      assert.strictEqual(actual[n.tests.reachable].currentURL, subpageChecklist.url);
    });

    it(`should provide the errors from the unreachable ${n.code} subpage.`, () => {
      // Given an unreachable subpage with errors
      const subpageChecklist = checklistFactory.create("https://subpage.com");
      subpageChecklist.errors = ["Test"];

      // And a checklist containing the subpage
      const checklist = checklistFactory.create("https://homepage.com");
      checklist.subpages.push(subpageChecklist);

      // And a term of the checklist that links to the subpage
      checklist.terms[n.code].links = [
        "https://subpage.com"
      ];

      // When testing this checklist
      const actual = of(checklist);

      // Then the errors should be copied to the test
      assert.strictEqual(actual[n.tests.reachable].errors, subpageChecklist.errors);
    });
  });
});