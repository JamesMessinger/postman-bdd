'use strict';

var log = require('./log');
var cookies = require('./cookies');

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
      if (typeof postman === 'object' && typeof postman.getResponseHeader === 'function') {
        return postman.getResponseHeader(name);
      }
      else {
        name = (name || '').toLowerCase();
        return this.headers[name];
      }
    },

    /**
     * Returns the value of the given cookie.
     *
     * @param {string} name
     * @returns {?string}
     */
    getCookie: function (name) {
      if (typeof postman === 'object' && typeof postman.getResponseCookie === 'function') {
        return postman.getResponseCookie(name);
      }
      else {
        return cookies.getCookie(this.cookies, name);
      }
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
      return Math.floor(this.status / 100);
    },

    /**
     * Indicates whether the response is an HTTP "info" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    info: function () {
      return this.statusType === 1;
    },

    /**
     * Indicates whether the response is an HTTP "ok" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    ok: function () {
      return this.statusType === 2;
    },

    /**
     * Indicates whether the response is an HTTP "redirect" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    redirect: function () {
      return this.statusType === 3;
    },

    /**
     * Indicates whether the response is an HTTP "client error" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    clientError: function () {
      return this.statusType === 4;
    },

    /**
     * Indicates whether the response is an HTTP "server error" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    serverError: function () {
      return this.statusType === 5;
    },

    /**
     * Indicates whether the response is an HTTP error status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    error: function () {
      return this.clientError || this.serverError;
    },

    /**
     * Indicates whether the response is an HTTP "accepted" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    accepted: function () {
      return this.status === 202;
    },

    /**
     * Indicates whether the response is an HTTP "no content" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    noContent: function () {
      return this.status === 204 || this.status === 1223;
    },

    /**
     * Indicates whether the response is an HTTP "bad request" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    badRequest: function () {
      return this.status === 400;
    },

    /**
     * Indicates whether the response is an HTTP "unauthorized" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    unauthorized: function () {
      return this.status === 401;
    },

    /**
     * Indicates whether the response is an HTTP "not acceptable" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    notAcceptable: function () {
      return this.status === 406;
    },

    /**
     * Indicates whether the response is an HTTP "not found" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    notFound: function () {
      return this.status === 404;
    },

    /**
     * Indicates whether the response is an HTTP "forbidden" status
     *
     * https://visionmedia.github.io/superagent/#response-status
     *
     * @type {boolean}
     */
    forbidden: function () {
      return this.status === 403;
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
      var parsedBody = parseResponeBody(this);

      // Replace this getter function with the parsed response body
      Object.defineProperty(this, 'body', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: parsedBody,
      });

      return parsedBody;
    },

    /**
     * The parsed response headers, with lowercased field names.
     *
     * NOTE: SuperAgent exposes this property as both `header` and `headers`
     *
     * @type {object}
     */
    header: function () {
      return typeof responseHeaders === 'object' ? responseHeaders : {};
    },

    /**
     * The parsed response headers, with lowercased field names.
     *
     * NOTE: SuperAgent exposes this property as both `header` and `headers`
     *
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
      var contentType = this.getHeader('content-type') || '';
      return contentType.split(';')[0];
    },

    /**
     * Returns the value of the Content-Type header without the MIME type (e.g. "utf8")
     * @type {string}
     */
    charset: function () {
      var contentType = this.getHeader('content-type') || '';
      var match = /charset=([a-zA-Z0-9_-]+)/i.exec(contentType);
      if (!match) { return ''; }
      return match[1];
    },

    /**
     * The parsed response cookies.
     *
     * @type {object[]}
     */
    cookies: function () {
      if (typeof responseCookies === 'object' && responseCookies.length > 0) {
        return responseCookies;
      }

      var header = this.getHeader('set-cookie');
      return cookies.parseResponseCookies(header);
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
 * Parses the response body as JSON, XML, or plain-text
 *
 * @param {object} response
 * @returns {object|string}
 */
function parseResponeBody (response) {
  if (response.type.indexOf('json') >= 0) {
    // The response looks like a JSON mime type (e.g. "text/json", "application/hal+json", etc.)
    try {
      return JSON.parse(response.text);
    }
    catch (err) {
      log.error('Unable to parse the response body as JSON', log.errorToPOJO(err));
    }
  }

  if (response.type.indexOf('xml') >= 0) {
    // The response looks like an XML mime type (e.g. "text/xml", "application/soap+xml", etc.)
    try {
      var json = xml2Json(response.text);

      // NOTE: The objects that xml2Json returns don't inherit from the Object prototype,
      // which means they don't work with Chai's `should` syntax.  So we re-parse the JSON
      // structure to convert the objects to "normal" objects that work with Chai.
      return JSON.parse(JSON.stringify(json));
    }
    catch (err) {
      log.error('Unable to parse the response body as XML', log.errorToPOJO(err));
    }
  }

  // If all else fails, just return the response body as plain-text
  return response.text;
}
