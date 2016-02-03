var Runnable = require('./runnable');
var Hook = require('./hook');
var runtime = require('./runtime');
var state = require('./state');
var hooks = {};

['before', 'after', 'beforeEach', 'afterEach'].forEach(function(name) {
  var hook = hooks[name] = new Hook(name);
  runtime.global[name] = hook.push.bind(hook);
  runtime.global[name].pop = hook.pop.bind(hook);
  runtime.global[name].clear = hook.clear.bind(hook);
  runtime.global[name].count = hook.count.bind(hook);
});

/**
 * Runs a test suite.
 *
 * Any "before" hooks are run first.  Any "after" hooks are run afterward.
 *
 * @param {string} [title] - Optional title for this test suite
 * @param {function} fn - The test suite to run
 * @returns {object} - An object with test names as keys, and boolean results as values
 */
describe = function(title, fn) {
  if (state.stack.length === 0) {
    // This is the first `describe` block in a new test script, so reset all state
    state.reset();
    hooks.before.run();
  }

  var runnable = new Runnable('describe', title, fn);
  runnable.run();

  if (state.stack.length === 0) {
    hooks.after.run();
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
it = function(title, fn) {
  hooks.beforeEach.run();

  var runnable = new Runnable('it', title, fn);
  runnable.run();

  hooks.afterEach.run();
  return runnable.result;
};
