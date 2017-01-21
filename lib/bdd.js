'use strict';

var Runnable = require('./runnable');
var Hook = require('./hook');
var state = require('./state');

module.exports = PostmanBDD;

/**
 * The Postman BDD runtime
 */
function PostmanBDD () {
  this.hooks = {
    before: new Hook('before'),
    after: new Hook('after'),
    beforeEach: new Hook('beforeEach'),
    afterEach: new Hook('afterEach'),
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
  if (state.stack.length === 0) {
    // This is the first `describe` block in a new test script, so reset all state
    state.reset();
    this.hooks.before.run();
  }

  var runnable = new Runnable('describe', title, fn);
  runnable.run();

  if (state.stack.length === 0) {
    this.hooks.after.run();
  }
  return state.results;
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
  this.hooks.beforeEach.run();

  var runnable = new Runnable('it', title, fn);
  runnable.run();

  this.hooks.afterEach.run();
  return runnable.result;
};
