var runtime = require('./runtime');
var chai = require('chai');

var globalScope, globalValues, globalNames = [];

if (runtime.newman) {
  // Newman completely resets global state for each request,
  // so we use Lodash (_) as a state bag, since it persists across requests
  globalScope = this;
  globalValues = _;
}
else {
  // The Chrome App and Electron App already persist state across requests,
  // So no need to use Lodash as a state bag
  globalScope = global;
  globalValues = global;
}

/**
 * Creates globals (such as `describe`, `it`, `beforeEach`, etc.) and ensures that they will
 * be available across multiple requests.
 */
module.exports = {
  /**
   * Registers a new global.
   *
   * Note: We use Lodash (_) as a state bag, since it persists across requests.
   */
  register: function(name, value) {
    if (globalNames.indexOf(name) === -1) globalNames.push(name);
    globalValues[name] = value;
    globalScope[name] = value;
    return value;
  },

  /**
   * Restores globals to the global scope.
   * This is necessary because the global scope is reset for each request.
   */
  restore: function() {
    globalNames.forEach(function(name) {
      globalScope[name] = globalValues[name];
    });

    chai.should();
  }
};
