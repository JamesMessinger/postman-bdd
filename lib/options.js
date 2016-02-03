'use strict';

var postman = require('./postman');

module.exports = {
  /**
   * If you have a debugger attached (Node.js debugger, browser dev tools, IDE, etc.),
   * then the debugger will automatically pause whenever an assertion fails.
   * This is a great way to easily find and fix failing tests in Postman.
   *
   * To disable this feature, set this option to false.
   */
  debug: true,

  /**
   * When running in a GUI environment (Postman Chrome App or Electron app),
   * console logging is enabled by default.
   *
   * When running in a terminal environment (Newman), console logging is disabled by default.
   *
   * Either way, you can override the default behavior by setting this option to true/false.
   */
  log: !postman.newman,
};
