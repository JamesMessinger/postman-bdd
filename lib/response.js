'use strict';

/**
 * SuperAgent's Response API
 *
 * For more info, see:
 * https://visionmedia.github.io/superagent/#response-properties
 */
module.exports = function SuperAgent () {
  var superAgent = this;

  superAgent.response = {
    /**
     * Returns the value of the given header.  Header names are case insensitive.
     *
     * https://visionmedia.github.io/superagent/#response-content-type
     *
     * @param {string} name
     * @returns {?string}
     */
    getHeader: function (name) {
      name = name.toLowerCase();
      return getResponseHeader(name) || superAgent.response.header[name];
    },

    /**
     * Returns the value of the given cookie.
     *
     * @param {string} name
     * @returns {?string}
     */
    getCookie: function (name) {
      return getResponseCookie(name);
    },
  };

  defineProperties(superAgent.response, {
    /**
     * Returns the HTTP response status code
     * @type {number}
     */
    status: function () {
      return typeof responseCode === 'object' ? responseCode.code : 0;
    },

    /**
     * Returns the HTTP response status type (1, 2, 3, 4, or 5)
     * @type {number}
     */
    statusType: function () {
      return Math.floor(superAgent.response.status / 100);
    },

    /**
     * Indicates whether the response is an HTTP "info" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    info: function () {
      return superAgent.response.statusType === 1;
    },

    /**
     * Indicates whether the response is an HTTP "ok" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    ok: function () {
      return superAgent.response.statusType === 2;
    },

    /**
     * Indicates whether the response is an HTTP "client error" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    clientError: function () {
      return superAgent.response.statusType === 4;
    },

    /**
     * Indicates whether the response is an HTTP "server error" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    serverError: function () {
      return superAgent.response.statusType === 5;
    },

    /**
     * Indicates whether the response is an HTTP error status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    error: function () {
      return superAgent.response.clientError || superAgent.response.serverError;
    },

    /**
     * Indicates whether the response is an HTTP "accepted" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    accepted: function () {
      return superAgent.response.status === 202;
    },

    /**
     * Indicates whether the response is an HTTP "no content" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    noContent: function () {
      return superAgent.response.status === 204 || superAgent.response.status === 1223;
    },

    /**
     * Indicates whether the response is an HTTP "bad request" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    badRequest: function () {
      return superAgent.response.status === 400;
    },

    /**
     * Indicates whether the response is an HTTP "unauthorized" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    unauthorized: function () {
      return superAgent.response.status === 401;
    },

    /**
     * Indicates whether the response is an HTTP "not acceptable" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    notAcceptable: function () {
      return superAgent.response.status === 406;
    },

    /**
     * Indicates whether the response is an HTTP "not found" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    notFound: function () {
      return superAgent.response.status === 404;
    },

    /**
     * Indicates whether the response is an HTTP "forbidden" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    forbidden: function () {
      return superAgent.response.status === 403;
    },

    /**
     * Returns the unparsed response body string
     * @type {string}
     */
    text: function () {
      return typeof responseBody === 'string' ? responseBody : '';
    },

    /**
     * The parsed response body.
     * @type {object}
     */
    body: function () {
      try {
        return JSON.parse(superAgent.response.text);
      }
      catch (e) {
        return {};
      }
    },

    /**
     * The parsed response headers, with lowercased field names.
     * @type {object}
     */
    headers: function () {
      return typeof responseHeaders === 'object' ? responseHeaders : {};
    },

    /**
     * The response time, in milliseconds
     * @type {number}
     */
    time: function () {
      return typeof responseTime === 'number' ? responseTime : 0;
    },

    /**
     * Returns the value of the Content-Type header without the charset (e.g. "text/html")
     * @type {string}
     */
    type: function () {
      var contentType = superAgent.response.getHeader('content-type') || '';
      return contentType.split(';')[0];
    },

    /**
     * Returns the value of the Content-Type header without the MIME type (e.g. "utf8")
     * @type {string}
     */
    charset: function () {
      var contentType = superAgent.response.getHeader('content-type') || '';
      var match = /charset=([a-zA-Z0-9_-]+)/i.exec(contentType);
      if (!match) { return ''; }
      return match[1];
    },
  });
};

/**
 * Defines the read-only property getters on the given object
 *
 * @param {object} getters
 */
function defineProperties (obj, getters) {
  Object.keys(getters).forEach(function (name) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: true,
      get: getters[name],
    });
  });
}

/**
 * Calls {@link postman.getResponseHeader}, if it exists
 *
 * @param {string} name
 * @returns {string|undefined}
 */
function getResponseHeader (name) {
  if (typeof postman === 'object' && typeof postman.getResponseHeader === 'function') {
    return postman.getResponseHeader(name);
  }
}

/**
 * Calls {@link postman.getResponseCookie}, if it exists
 *
 * @param {string} name
 * @returns {string|undefined}
 */
function getResponseCookie (name) {
  if (typeof postman === 'object' && typeof postman.getResponseCookie === 'function') {
    return postman.getResponseCookie(name);
  }
}
