'use strict';

var Runnable = require('./runnable');
var state = require('./state');

module.exports = Hook;

/**
 * A hook is a list of runnables to run before/after a `describe` or `it` block.
 */
function Hook(name) {
  this.name = name;
  this.runnables = [];
}

/**
 * Runs all of this hook's runnables
 */
Hook.prototype.run = function() {
  // Don't run if we're already in a hook
  if (!state.inAHook()) {
    this.runnables.forEach(function(runnable) {
      runnable.run();
    });
  }
};

/**
 * Adds a new runnable for this hook
 */
Hook.prototype.push = function(title, fn) {
  var runnable = new Runnable(this.name, title, fn);
  runnable.isHook = true;
  this.runnables.push(runnable);
};

/**
 * Removes the last runnable from this hook
 */
Hook.prototype.pop = function() {
  this.runnables.pop();
};

/**
 * Removes all runnables from this hook
 */
Hook.prototype.clear = function() {
  this.runnables = [];
};

/**
 * Returns the number of runnables for this hook
 */
Hook.prototype.count = function() {
  return this.runnables.length;
};
