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
   * Used to build unique paths for each Runnable
   */
  this._pathCounter = 0;
}

/**
 * Returns the full path of the current Runnable (the top one on the stack)
 *
 * @returns {string}
 */
State.prototype.currentPath = function () {
  var currentRunnable = this.stack[this.stack.length - 1];
  var path = '';

  if (currentRunnable.type !== 'describe') {
    path = ++this._pathCounter + '. ';
  }

  // SPECIAL CASE: If we're in a "before" or "after" hook,
  // and there's no meaningful test suite name, then only return the hook's name.
  if (currentRunnable.type === 'before' || currentRunnable.type === 'after') {
    var inANamedTestSuite = this.stack.some(function (runnable) {
      return runnable.type === 'describe' && runnable.isNamed;
    });

    if (!inANamedTestSuite) {
      return path + currentRunnable.title;
    }
  }

  path += this.stack.map(function (runnable) { return runnable.title; }).join(' - ');
  return path;
};

State.prototype.isStarted = function () {
  return this._pathCounter > 0;
};

/**
 * Determines whether the test script has finished
 * (i.e. the top-level `describe` block has finished running)
 *
 * @returns {boolean}
 */
State.prototype.isFinished = function () {
  return this.stack.length === 1 && this.counters.describe > 0;
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
