'use strict';

module.exports = State;

/**
 * Keeps track of the state for a single Postman test script.
 */
function State () {
  /**
   * Postman's global `tests` variable.
   * All test results must be stored on this object as boolean properties
   */
  this.results = resetTests();

  /**
   * The stack of runnables that are currently running
   */
  this.stack = [];

  /**
   * Keeps track of how many runnables of each type are currently running.
   */
  this.counters = {
    describe: 0,
    it: 0,
    before: 0,
    after: 0,
    beforeEach: 0,
    afterEach: 0,
  };

  /**
   * Pretty formatting for the stack
   */
  this.stack.toString = function () {
    return this.map(function (r) { return r.title; }).join(' ');
  };
}

/**
 * Determines whether the test script has started
 * (i.e. at least one `describe`, `it`, or hook has started)
 *
 * @returns {boolean}
 */
State.prototype.isStarted = function () {
  var me = this;

  if (this.stack.length > 0) {
    // We're currently in a Runnable
    return true;
  }
  else {
    // Have any Runnables ran yet?
    return Object.keys(this.counters).some(function (key) {
      return me.counters[key] > 0;
    });
  }
};

/**
 * Determines whether the test script has finished
 * (i.e. the top-level `describe` block has finished running)
 *
 * @returns {boolean}
 */
State.prototype.isFinished = function () {
  return this.stack.length === 0 && this.counters.describe > 0;
};

/**
 * Determines whether we are currently inside a hook
 *
 * @returns {boolean}
 */
State.prototype.inAHook = function () {
  return this.stack.some(function (runnable) {
    return runnable.isHook;
  });
};

/**
 * Deletes all properties of the Postman `tests` object, to reset any previous
 * test state. This is necessary when the user clicks the "Send" button multiple
 * times in Request Builder, which re-uses the same `tests` object each time.
 *
 * @reeturns {object} - Returns the empty `tests` object
 */
function resetTests () {
  if (typeof tests !== 'object') {
    throw new Error(
      'Postman BDD can only run inside the Postman scripting runtime ' +
      '(the "tests" global variable is missing)'
    );
  }

  // Clear any results from a previous test run
  // (this happens when the user user clicks the "send" button multiple times in Request Builder)
  Object.keys(tests).forEach(function (key) {
    delete tests[key];
  });

  return tests;
}
