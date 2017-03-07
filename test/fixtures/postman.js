'use strict';

const tv4 = require('tv4');
const xml2js = require('xml2js');

/**
 * A mock instance of the Postman scripting runtime for tests.
 */
module.exports = class Postman {
  /**
   * @param {object} test - A Tape test instance
   * @param {object} [globals] - Overrides for Postman sandbox globals
   */
  constructor (test, globals) {
    // Store the Tape test instance, so we can perform assertions on it later
    this.test = test;

    // Re-initialize the mock Postman's test sandbox
    initPostmanSandbox(globals || {});

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
 * Creates global objects to simulate Postman's test sandbox
 *
 * {@link https://www.getpostman.com/docs/sandbox}
 * @param {object} [globals] - Overrides for Postman sandbox globals
 */
function initPostmanSandbox (globals) {
  global.responseBody = globals.responseBody || '';
  global.responseTime = globals.responseTime || 0;
  global.responseHeaders = globals.responseHeaders || {};

  global.responseCode = Object.assign(
    {
      code: 0,
      name: '',
      detail: '',
    },
    globals.responseCode
  );

  global.request = Object.assign(
    {
      method: '',
      url: '',
      headers: {},
      data: {},
    },
    globals.request
  );

  // The `tests` object always starts-off empty
  global.tests = {};

  // Expose tv4 directly
  global.tv4 = tv4;

  // Expose xml2js indirectly
  global.xml2Json = function (xml) {
    let options = {
      explicitArray: false,
      async: false,
      trim: true,
      mergeAttrs: false
    };

    let JSON = {};
    xml2js.parseString(xml, options, (err, result) => JSON = result);
    return JSON;
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
