'use strict';

/**
 * A mock instance of the Postman scripting runtime for tests.
 */
module.exports = class Postman {
  /**
   * @param {object} test - A Tape test instance
   */
  constructor (test) {
    // Store the Tape test instance, so we can perform assertions on it later
    this.test = test;

    // Re-initialize the mock Postman's test sandbox
    initPostmanSandbox();

    // Re-initialize Postman BDD, to clear any previous hooks or test state
    let postmanBDD = require('../../');
    postmanBDD.reset();

    // Turn off Postman BDD logging
    postmanBDD.logLevel = 'silent';
  }

  /**
   * Allows tests to set modify Postman's `request` object
   */
  get request () {
    return global.request;
  }

  /**
   * Allows tests to set modify Postman's `responseCode` object
   */
  get responseCode () {
    return global.responseCode;
  }

  /**
   * Allows tests to set modify Postman's `responseHeaders` object
   */
  get responseHeaders () {
    return global.responseHeaders;
  }

  /**
   * Allows tests to set modify Postman's `responseBody` property
   */
  set responseBody (value) {
    global.responseBody = value;
  }

  /**
   * Allows tests to set modify Postman's `responseTime` property
   */
  set responseTime (value) {
    global.responseTime = value;
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
 * Creates global objects to simulate Postman's test sandbox
 * @link https://www.getpostman.com/docs/sandbox
 */
function initPostmanSandbox () {
  global.tests = {};
  global.responseBody = '';
  global.responseTime = 0;
  global.responseHeaders = {};
  global.responseCode = {
    code: 0,
    name: '',
    detail: '',
  };
  global.request = {
    method: '',
    url: '',
    headers: {},
    data: {},
  };

  global.postman = {
    getResponseHeader (name) {
      return global.responseHeaders[(name || '').toLowerCase()];
    },

    getResponseCookie () {},
  };
}

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
    let msg = `tests[${i}] is named "${actualKey}"`;

    if (actualKey === expectedKey) {
      test.equal(actualKey, expectedKey, msg);
    }
    else {
      msg += `, not "${expectedKey}"`;
      test.equal(actualKey, expectedKey, msg);
      process.exit(1);
    }
  }

  // Compare the entire arrays, just to be sure
  test.deepEqual(actualKeys, expectedKeys, `All ${length} tests were run`);
}

/**
 * Checks the result of each test to make sure they all match the expected results.
 *
 * @param {object} test - The Tape test object
 * @param {object} actual - The actual Postman `tests` object
 * @param {object} expected - The expected Postman `tests` object
 */
function checkTestResults (test, actual, expected) {
  let actualKeys = Object.keys(actual);
  let expectedKeys = Object.keys(expected);
  let length = Math.max(actualKeys.length, expectedKeys.length);

  // Check each test one-by-one,
  // so we can throw a nicer error message if the results don't match.
  for (let key of expectedKeys) {
    let actualResult = actual[key] ? 'passed' : 'failed';
    let expectedResult = expected[key] ? 'passed' : 'failed';

    if (actualResult === expectedResult) {
      let msg = `${key} ${expectedResult}`;
      test.equal(actualResult, expectedResult, msg);
    }
    else {
      let msg = `${key} should have ${expectedResult}, but it ${actualResult}`;
      test.equal(actualResult, expectedResult, msg);
      process.exit(1);
    }
  }

  // Compare the entire objects, just to be sure
  test.deepEqual(actual, expected, `All ${length} test results are correct`);
}
