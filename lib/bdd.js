'use strict';

var Runnable = require('./runnable');
var Hook = require('./hook');
var State = require('./state');

module.exports = PostmanBDD;

/**
 * The Postman BDD runtime
 */
function PostmanBDD () {
  var state = this.state = new State();

  this.hooks = {
    before: new Hook('before', state),
    after: new Hook('after', state),
    beforeEach: new Hook('beforeEach', state),
    afterEach: new Hook('afterEach', state),
  };

  this.before = PostmanBDD.prototype.before.bind(this);
  this.after = PostmanBDD.prototype.after.bind(this);
  this.beforeEach = PostmanBDD.prototype.beforeEach.bind(this);
  this.afterEach = PostmanBDD.prototype.afterEach.bind(this);
  this.describe = PostmanBDD.prototype.describe.bind(this);
  this.it = PostmanBDD.prototype.it.bind(this);
}

/**
 * Registers a function to be called before any tests for a request.
 *
 * @param {string} [title] - Optinoal title for this hook
 * @param {function} fn - The hook to run
 */
PostmanBDD.prototype.before = function (title, fn) {
  this.hooks.before.push(title, fn);
};

/**
 * Registers a function to be called after all tests for a request.
 *
 * @param {string} [title] - Optinoal title for this hook
 * @param {function} fn - The hook to run
 */
PostmanBDD.prototype.after = function (title, fn) {
  this.hooks.after.push(title, fn);
};

/**
 * Registers a function to be called before each test.
 *
 * @param {string} [title] - Optinoal title for this hook
 * @param {function} fn - The hook to run
 */
PostmanBDD.prototype.beforeEach = function (title, fn) {
  this.hooks.beforeEach.push(title, fn);
};

/**
 * Registers a function to be called after each test.
 *
 * @param {string} [title] - Optinoal title for this hook
 * @param {function} fn - The hook to run
 */
PostmanBDD.prototype.afterEach = function (title, fn) {
  this.hooks.afterEach.push(title, fn);
};

/**
 * Runs a test suite.
 *
 * Any "before" hooks are run first.  Any "after" hooks are run afterward.
 *
 * @param {string} [title] - Optional title for this test suite
 * @param {function} fn - The test suite to run
 * @returns {object} - An object with test names as keys, and boolean results as values
 */
PostmanBDD.prototype.describe = function (title, fn) {
  this.oneTimeInitialization();

  var runnable = new Runnable('describe', this.state, title, fn);
  runnable.run();

  if (this.state.isFinished()) {
    // This is a top-level `describe` block, so run any `after` hooks
    this.hooks.after.run();
  }

  return this.state.results;
};

/**
 * Runs a single test
 *
 * Any "beforeEach" hooks are run first.  Any "afterEach" hooks are run after.
 *
 * @param {string} [title] - Optional title for this test
 * @param {function} fn - The test to run
 * @returns {boolean} - The boolean result of the test
 */
PostmanBDD.prototype.it = function (title, fn) {
  this.oneTimeInitialization();
  this.hooks.beforeEach.run();

  var runnable = new Runnable('it', this.state, title, fn);
  runnable.run();

  this.hooks.afterEach.run();
  return runnable.result;
};

/**
 * Inititializes state and runs `before` hooks before the first Runnable
 * in a new test script.
 */
PostmanBDD.prototype.oneTimeInitialization = function () {
  if (!this.state.isStarted()) {
    // This is the first Runnable in a new test script,
    // so reset all state and run any `before` hooks
    this.hooks.before.run();
  }
};

