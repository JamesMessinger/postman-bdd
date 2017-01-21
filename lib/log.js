'use strict';

var options = require('./options');

var levels = ['silent', 'error', 'warn', 'info', 'debug'];

var log = module.exports = {
  /**
   * Determines whether the given logging level is enabled
   *
   * @param {string} level
   * @returns {boolean}
   */
  isEnabled: function (level) {
    return levels.indexOf(options.logLevel) >= levels.indexOf(level);
  },
};

levels.forEach(function (level) {
  log[level] = function () {
    if (this.isEnabled(level)) {
      var logMethod = console.log;
      if (typeof console[level] === 'function') {
        logMethod = console[level];
      }

      logMethod.apply(console, arguments);
    }
  };
});
