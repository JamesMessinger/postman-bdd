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
    // Make sure the order is correct
    let actualKeys = Object.keys(global.tests);
    let expectedKeys = Object.keys(expected);
    this.test.deepEqual(actualKeys, expectedKeys);

    // Make sure the results are correct
    this.test.deepEqual(global.tests, expected);
  }
};
