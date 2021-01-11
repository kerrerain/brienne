const assert = require('assert');
const { of, TEST_INVALID } = require('../src/tests');
const checklistFactory = require('../src/checklist');

describe('The of function', () => {
  const testCasesInvalidByDefault = [
    'A11Y_0',
    'A11Y_1',
    'A11Y_2',
    'A11Y_3',
    'A11Y_4',
    'A11Y_5',
    'A11Y_6',
    'RGAA_1',
    'RGAA_2',
    'RGAA_3',
    'RGAA_4',
    'RGAA_5',
    'RGAA_6',
    'RGAA_7_1',
    'RGAA_7_2',
    'RGAA_7_3',
    'RGAA_8',
    'RGAA_9',
    'RGAA_10',
  ];
  testCasesInvalidByDefault.forEach((n) => {
    it(`should set test ${n} to ${TEST_INVALID} by default.`, () => {
      // Given a checklist
      const checklist = checklistFactory.create('https://homepage.com');

      // And the code of a test
      const code = n;

      // When testing this checklist
      const actual = of(checklist);

      // Then the result for this test should be invalid
      assert.strictEqual(actual[code].result, TEST_INVALID);
    });
  });
});
