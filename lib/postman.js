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
  return !process.browser;
}

function detectChromeApp() {
  return process.browser;
}

function detectElectronApp() {
  return process.browser;
}

function detectRequestBuilder() {
  return process.browser &&
    window.parent && window.parent.document &&
    typeof window.parent.document.querySelector === 'function' &&
    !!window.parent.document.querySelector('#request-builder-view');
}

function detectCollectionRunner() {
  return !detectRequestBuilder();
}
