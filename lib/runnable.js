'use strict';

var runtime = require('./runtime');
var state = require('./state');
var options = require('./options');

module.exports = Runnable;

/**
 * Runs a user-defined function, and captures the results.
 * Runnables include test suites (describe), tests (it), and hooks (before, after, beforeEach, afterEach)
 *
 * @param {string} type - The type of runnable ("describe", "it", "before", "afterEach", etc.)
 * @param {string} [title] - Optional title for the runnable
 * @param {function} fn - The function to run
 * @class
 */
function Runnable(type, title, fn) {
  if (typeof title === 'function') {
    fn = title;
    title = '';
  }

  this.type = type;
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
 *
 * NOTE: When running in the Postman Request Builder, errors are THROWN rather than being
 * captured as boolean values.  This way, the error appears in the Postman UI.
 */
Runnable.prototype.run = function run() {
  state.counters[this.type]++;
  this.title = this.title || ((this.type === 'it' ? 'test' : this.type) + ' #' + state.counters[this.type]);

  state.stack.push(this);
  var fullTitle = state.stack.toString();
  options.log && console.log('Running ' + fullTitle);

  try {
    this.fn();
    this.success(fullTitle);
  }
  catch (e) {
    this.failure(e, fullTitle);
  }
  finally {
    state.stack.pop();
  }
};

/**
 * Records a successful result for this runnable.
 *
 * @param {string} [fullTitle] - The full title (including any parent Runnables)
 */
Runnable.prototype.success = function(fullTitle) {
  this.result = true;
  if (this.type === 'it') {
    state.results[fullTitle || this.title] = true;
  }
};

/**
 * Records a failure result for this runnable.
 *
 * @param {Error} err - The error that occurred
 * @param {string} [fullTitle] - The full title (including any parent Runnables)
 */
Runnable.prototype.failure = function(err, fullTitle) {
  options.log && (typeof console.error === 'function' ? console.error(err) : console.log(err));

  // If a debugger is attached, then break on errors
  if (options.debug) {
    debugger;
  }

  this.result = false;
  this.error = err;
  state.results[fullTitle || this.title] = false;
  state.results[err.message] = false;

  // If we're running in the Postman Request Builder, then re-throw the error.
  // This will make it show-up in the Postman UI.
  if (runtime.requestBuilder) {
    throw err;
  }
};
