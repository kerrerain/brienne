const assert = require('assert');
const { of, TEST_VALID, TEST_INVALID } = require('../src/tests');
const checklistFactory = require('../src/checklist');

describe('The of function', () => {
  it('should set RGAA_4 to valid if the déclaration de conformité is on a subpage.', () => {
    // Given a checklist with a subpage
    const checklist = checklistFactory.create('https://homepage.com');
    const subpageChecklist = checklistFactory.create('https://subpage.com');
    checklist.subpages.push(subpageChecklist);

    // And the matching term of RGAA_1 has been found on the subpage
    subpageChecklist.terms.RGAA_1.exists = true;

    // When testing this checklist
    const actual = of(checklist);

    // Then the result for this test should be valid
    assert.strictEqual(actual.RGAA_4.result, TEST_VALID);

    // And it should set the url of the subpage
    assert.strictEqual(actual.RGAA_4.currentURL, subpageChecklist.url);
  });

  it('should set RGAA_4 to valid if the déclaration de conformité is on both pages.', () => {
    // Given a checklist with a subpage
    const checklist = checklistFactory.create('https://homepage.com');
    const subpageChecklist = checklistFactory.create('https://subpage.com');
    checklist.subpages.push(subpageChecklist);

    // And the matching term of RGAA_1 has been found on the homepage
    checklist.terms.RGAA_1.exists = true;

    // And the matching term of RGAA_1 has been found on the subpage
    subpageChecklist.terms.RGAA_1.exists = true;

    // When testing this checklist
    const actual = of(checklist);

    // Then the result for this test should be valid
    assert.strictEqual(actual.RGAA_4.result, TEST_VALID);
  });

  it('should set RGAA_4 to invalid if the déclaration de conformité is only on the homepage.', () => {
    // Given
    const checklist = checklistFactory.create('https://homepage.com');

    // And the matching term of RGAA_1 has been found
    checklist.terms.RGAA_1.exists = true;

    // When testing this checklist
    const actual = of(checklist);

    // Then the result for this test should be invalid
    assert.strictEqual(actual.RGAA_4.result, TEST_INVALID);
  });

  it('should set RGAA_5 to valid if the déclaration de conformité is a link.', () => {
    // Given a checklist with a subpage
    const checklist = checklistFactory.create('https://homepage.com');
    const subpageChecklist = checklistFactory.create('https://subpage.com');
    checklist.subpages.push(subpageChecklist);

    // And the matching term of RGAA_1 has been found on the subpage
    subpageChecklist.terms.RGAA_1.exists = true;

    // And there's at least a link matching the RGAA_1 term
    subpageChecklist.terms.RGAA_1.links = ['https://declaration.com'];

    // When testing this checklist
    const actual = of(checklist);

    // Then the result for this test should be valid
    assert.strictEqual(actual.RGAA_5.result, TEST_VALID);

    // And it should set the url of the subpage
    assert.strictEqual(actual.RGAA_5.currentURL, subpageChecklist.url);
  });

  it('should set RGAA_6 to valid if the déclaration de conformité is reachable.', () => {
    // Given a checklist with a subpage and a sub-subpage
    const checklist = checklistFactory.create('https://homepage.com');
    const subpageChecklist = checklistFactory.create('https://subpage.com');
    const subsubpageChecklist = checklistFactory.create('https://declaration.com');
    checklist.subpages.push(subpageChecklist);
    subpageChecklist.subpages.push(subsubpageChecklist);

    // And the matching term of RGAA_1 has been found on the subpage
    subpageChecklist.terms.RGAA_1.exists = true;

    // And there's at least a link matching the RGAA_1 term
    subpageChecklist.terms.RGAA_1.links = ['https://declaration.com'];

    // And the page mentioned bye the link is reachable
    subsubpageChecklist.reachable = true;

    // When testing this checklist
    const actual = of(checklist);

    // Then the result for this test should be valid
    assert.strictEqual(actual.RGAA_6.result, TEST_VALID);

    // And it should set the url of the sub-subpage
    assert.strictEqual(actual.RGAA_6.currentURL, subsubpageChecklist.url);
  });
});
