'use strict';

/**
 * Information about the Postman environment we're running in
 */
module.exports = {
  /**
   * Are we running in Newman?
   */
  newman: detectNewman(),

  /**
   * Are we running the Chrome app?
   */
  chrome: detectChromeApp(),

  /**
   * Are we running in the Electron app?
   */
  electron: detectElectronApp(),

  /**
   * Are we running in the Postman Request Builder?
   */
  requestBuilder: detectRequestBuilder(),

  /**
   * Are we running in the Postman Collection Runner?
   */
  collectionRunner: detectCollectionRunner(),
};


function detectNewman() {
  return typeof process === 'object';
}

function detectChromeApp() {
  return detectBrowser();
}

function detectElectronApp() {
  return detectBrowser();
}

function detectRequestBuilder() {
  return detectBrowser() &&
    window.parent && window.parent.document &&
    typeof window.parent.document.querySelector === 'function' &&
    !!window.parent.document.querySelector('#request-builder-view');
}

function detectCollectionRunner() {
  return !detectRequestBuilder();
}

function detectBrowser() {
  return typeof window === 'object';
}
