'use strict';

var Runnable = require('./runnable');

module.exports = Hook;

/**
 * A hook is a list of runnables to run before/after a `describe` or `it` block.
 *
 * @param {string} type - The type of the hook (e.g. "before", "afterEach", etc)
 * @param {State} state - An object containing the state of the current test script
 */
function Hook (type, state) {
  this.type = type;
  this.state = state;
  this.runnables = [];
}

/**
 * Runs all of this hook's runnables
 */
Hook.prototype.run = function () {
  var me = this;

  // Don't run if we're already in a hook
  if (!this.state.inAHook()) {
    this.runnables.forEach(function (runnable) {
      me.state.stack.push(runnable);
      runnable.run();
      me.state.stack.pop();
    });
  }
};

/**
 * Adds a new runnable for this hook
 *
 * @param {string} [title] - Optional title for the runnable
 * @param {function} [fn] - The function to run
 */
Hook.prototype.push = function (title, fn) {
  var runnable = new Runnable(this.type, this.state, title, fn);
  runnable.isHook = true;
  this.runnables.push(runnable);
};
