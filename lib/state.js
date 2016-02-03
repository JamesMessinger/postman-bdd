'use strict';

/**
 * Keeps track of the state for a single Postman test script.
 */
var state = module.exports = {
  /**
   * Postman's global `tests` variable.
   * All test results must be stored on this object as boolean properties
   */
  results: typeof tests === 'object' ? tests : {},

  /**
   * The stack of runnables that are currently running
   */
  stack: [],

  /**
   * Keeps track of how many runnables of each type are currently running.
   */
  counters: {
    describe: 0,
    it: 0,
    before: 0,
    after: 0,
    beforeEach: 0,
    afterEach: 0,
  },

  /**
   * Determines whether we are currently inside a hook
   */
  inAHook: function() {
    return this.stack.some(function(runnable) {
      return runnable.isHook;
    });
  },

  /**
   * Resets all state.
   * This is called at the beginning of a Postman test script,
   * in case Postman BDD is being re-used across multiple requests
   */
  reset: function() {
    var me = this;

    // Clear any results from a previous test run
    // (this happens when the user user clicks the "send" button multiple times in Request Builder)
    var t = typeof tests === 'object' ? tests : {};
    Object.keys(t).forEach(function(key) {
      delete t[key];
    });
    me.results = t;

    // Reset all counters to zero
    Object.keys(this.counters).forEach(function(key) {
      me.counters[key] = 0;
    });
  }
};

/**
 * Pretty formatting for the stack
 */
state.stack.toString = function() {
  return this.map(function(r) { return r.title; }).join(' ');
};
