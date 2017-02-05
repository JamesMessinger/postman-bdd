'use strict';

/**
 * A mock instance of the Postman scripting runtime for tests.
 */
module.exports = class Postman {
  /**
   *
   * @param {object} test - A Tape test instance
   */
  constructor (test) {
    // Store the Tape test instance, so we can perform assertions on it later
    this.test = test;

    // Create a mock `tests` object to simulate Postman's test sandbox
    global.tests = {};

    // Re-initialize Postman BDD, to clear any previous hooks or test state
    let postmanBDD = require('../../');
    postmanBDD.reset();

    // Turn off Postman BDD logging
    postmanBDD.logLevel = 'silent';
  }

  /**
   * Compares the Postman `tests` object to the expected value.
   *
   * @param {object} expected
   */
  checkTests (expected) {
    checkTestOrder(this.test, global.tests, expected);
    checkTestResults(this.test, global.tests, expected);
  }
};

/**
 * Makes sure the order of the tests is correct.
 * This is important because whenever a test fails, Postman BDD injects the failure
 * message immediately after the failed test to help the user debug the failure.
 *
 * @param {object} test - The Tape test object
 * @param {object} actual - The actual Postman `tests` object
 * @param {object} expected - The expected Postman `tests` object
 */
function checkTestOrder (test, actual, expected) {
  let actualKeys = Object.keys(actual);
  let expectedKeys = Object.keys(expected);
  let length = Math.max(actualKeys.length, expectedKeys.length);

  // Check each key one-by-one,
  // so we can throw a nicer error message if the keys don't match.
  for (let i = 0; i < length; i++) {
    let actualKey = actualKeys[i];
    let expectedKey = expectedKeys[i];

    if (actualKey !== expectedKey) {
      // Fail the test
      let msg = `tests[${i}] is named "${actualKey}", not "${expectedKey}"`;
      test.equal(actualKey, expectedKey, msg);

      // Bail immediately
      process.exit(1);
    }
  }

  // Compare the entire arrays, just to be sure
  test.deepEqual(actualKeys, expectedKeys, 'All of the expected tests were run');
}

/**
 * Checks the result of each test to make sure they all match the expected results.
 *
 * @param {object} test - The Tape test object
 * @param {object} actual - The actual Postman `tests` object
 * @param {object} expected - The expected Postman `tests` object
 */
function checkTestResults (test, actual, expected) {
  // Check each test one-by-one,
  // so we can throw a nicer error message if the results don't match.
  for (let key of Object.keys(expected)) {
    let actualResult = actual[key] ? 'passed' : 'failed';
    let expectedResult = expected[key] ? 'passed' : 'failed';

    if (actualResult !== expectedResult) {
      // Fail the test
      let msg = `${key} should have ${expectedResult}, but it ${actualResult}`;
      test.equal(actualResult, expectedResult, msg);

      // Bail immediately
      process.exit(1);
    }
  }

  // Compare the entire objects, just to be sure
  test.deepEqual(actual, expected, 'All of the test results are correct');
}
