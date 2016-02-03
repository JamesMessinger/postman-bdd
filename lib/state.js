'use strict';

/* eslint no-undef:0 */
var Response = require('./response');

/**
 * Keeps track of the state for a single Postman test script.
 */
var state = module.exports = {
  /**
   * The HTTP response
   */
  response: new Response(),

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

    // Build a new Response object, based on the current values of the Postman globals
    global.response = me.response = new Response();

    // If there are test results from a previous test,
    // then we know that Postman BDD is being re-used across multiple requests.
    // So instead of using Postman's global `tests` variable, we need to use a new object.
    if (Object.keys(this.results).length > 0) {
      me.results = {};
    }

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
