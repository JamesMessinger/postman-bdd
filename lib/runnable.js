'use strict';

var log = require('./log');

module.exports = Runnable;

/**
 * Runs a user-defined function, and captures the results.
 * Runnables include test suites (describe), tests (it), and hooks (before, after, beforeEach, afterEach)
 *
 * @param {string} type - The type of runnable ("describe", "it", "before", "afterEach", etc.)
 * @param {State} state - An object containing the state of the current test script
 * @param {string} [title] - Optional title for the runnable
 * @param {function} [fn] - The function to run
 * @class
 */
function Runnable (type, state, title, fn) {
  if (typeof title === 'function') {
    fn = title;
    title = '';
  }

  this.type = type;
  this.state = state;
  this.isHook = false;
  this.title = title;
  this.fn = fn;
  this.result = null;
  this.error = null;
}

/**
 * Runs the user-defined function and captures the results.
 *
 * The result is a boolean value, which can be accessed at {@link Runnable#result}.
 * If no error occurrs, then the result is `true`.  For "it" tests, this result is also added
 * to {@link State.results}, so it can be returned to the Postman Collection Runner.
 * If an error DOES occur, then the result is `false`, and the result is ALWAYS added to
 * {@link State.results}, even for hooks and test suites.
 */
Runnable.prototype.run = function run () {
  this.state.counters[this.type]++;
  this.title = this.title ||
    ((this.type === 'it' ? 'test' : this.type) + ' #' + this.state.counters[this.type]);

  this.state.stack.push(this);
  var fullTitle = this.state.stack.toString();
  log.debug('Running ' + fullTitle);

  try {
    this.fn();
    this.success(fullTitle);
  }
  catch (e) {
    this.failure(e, fullTitle);
  }
  finally {
    this.state.stack.pop();
  }
};

/**
 * Records a successful result for this runnable.
 *
 * @param {string} [fullTitle] - The full title (including any parent Runnables)
 */
Runnable.prototype.success = function (fullTitle) {
  log.info('passed: ' + fullTitle);

  this.result = true;

  if (this.type === 'it') {
    this.state.results[fullTitle || this.title] = true;
  }
};

/**
 * Records a failure result for this runnable.
 *
 * @param {Error} err - The error that occurred
 * @param {string} [fullTitle] - The full title (including any parent Runnables)
 */
Runnable.prototype.failure = function (err, fullTitle) {
  log.error('failed: ' + fullTitle, errorToPOJO(err));

  this.result = false;
  this.error = err;
  this.state.results[fullTitle || this.title] = false;
  this.state.results[err.message] = false;
};

/**
 * Returns a POJO containing all the properties of the given Error object.
 * This is necessary because Postman's `console.log()` methods don't include
 * properties from the Error prototype.
 *
 * @param {Error} err
 * @returns {object|undefined}
 */
function errorToPOJO (err) {
  if (err && typeof err === 'object') {
    return Object.keys(err).concat(['name', 'message', 'stack']).reduce(function (pojo, key) {
      pojo[key] = err[key];
      return pojo;
    }, {});
  }
}
