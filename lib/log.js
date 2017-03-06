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

  /**
   * Returns a POJO containing all the properties of the given Error object.
   * This is necessary because Postman's `console.log()` methods don't include
   * properties from the Error prototype.
   *
   * @param {Error} err
   * @returns {object|undefined}
   */
  errorToPOJO: function (err) {
    if (err && typeof err === 'object') {
      return Object.keys(err).concat(['name', 'message', 'stack']).reduce(function (pojo, key) {
        pojo[key] = err[key];
        return pojo;
      }, {});
    }
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
