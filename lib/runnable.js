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

  state.counters[type]++;
  var friendlyType = type === 'it' ? 'test' : type;

  this.type = type;
  this.state = state;
  this.isHook = false;
  this.isNamed = !!title;
  this.title = title || (friendlyType + ' #' + state.counters[type]);
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
  var path = this.state.currentPath();
  log.debug('Running ' + path);

  if (this.type !== 'describe') {
    this.state.results[path] = null;
  }

  try {
    this.fn();
    this.success(path);
  }
  catch (e) {
    this.failure(e, path);
  }
};

/**
 * Records a successful result for this runnable.
 *
 * @param {string} [path] - The full path of the runnable
 */
Runnable.prototype.success = function (path) {
  log.info('passed: ' + path);

  this.result = true;

  if (this.type !== 'describe') {
    this.state.results[path] = true;
  }
};

/**
 * Records a failure result for this runnable.
 *
 * @param {Error} err - The error that occurred
 * @param {string} [path] - The full path of the runnable
 */
Runnable.prototype.failure = function (err, path) {
  log.error('failed: ' + path, log.errorToPOJO(err));

  this.result = false;
  this.error = err;
  delete this.state.results[path];
  this.state.results[path + ' (' + err.message + ')'] = false;
};
