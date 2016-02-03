/**
 * SuperAgent's Response API
 *
 * For more info, see:
 * https://visionmedia.github.io/superagent/#response-properties
 */
module.exports = Object.defineProperties({}, {
  /**
   * Returns the unparsed response body string
   * @type {string}
   */
  text: {
    configurable: true,
    enumerable: true,
    get: function() {
      return typeof responseBody === 'string' ? responseBody : '';
    }
  },

  /**
   * The parsed response body.
   * @type {object}
   */
  body: {
    configurable: true,
    enumerable: true,
    get: function() {
      try {
        return JSON.parse(this.text);
      }
      catch (e) {
        return {};
      }
    }
  },

  /**
   * The parsed response headers, with lowercased field names.
   * @type {object}
   */
  headers: {
    configurable: true,
    enumerable: true,
    get: function() {
      return typeof responseHeaders === 'object' ? responseHeaders : {};
    }
  },

  /**
   * The response time, in milliseconds
   * @type {number}
   */
  time: {
    configurable: true,
    enumerable: true,
    get: function() {
      return typeof responseTime === 'number' ? responseTime : 0;
    }
  },

  /**
   * Returns the value of the Content-Type header without the charset (e.g. "text/html")
   * @type {string}
   */
  type: {
    configurable: true,
    enumerable: true,
    get: function() {
      var contentType = this.getHeader('content-type') || '';
      return contentType.split(';')[0];
    }
  },

  /**
   * Returns the value of the Content-Type header without the MIME type (e.g. "utf8")
   * @type {string}
   */
  charset: {
    configurable: true,
    enumerable: true,
    get: function() {
      var contentType = this.getHeader('content-type') || '';
      var match = /charset=([a-zA-Z0-9_-]+)/i.exec(contentType);
      if (!match) return '';
      return match[1];
    }
  },

  /**
   * Returns the HTTP response status code
   * @type {number}
   */
  status: {
    configurable: true,
    enumerable: true,
    get: function() {
      return typeof responseCode === 'object' ? responseCode.code : 0;
    }
  },

  /**
   * Returns the HTTP response status type (1, 2, 3, 4, or 5)
   * @type {number}
   */
  statusType: {
    configurable: true,
    enumerable: true,
    get: function() {
      return Math.floor(this.status / 100);
    }
  },

  /**
   * Indicates whether the response is an HTTP "info" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  info: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.statusType === 1;
    }
  },

  /**
   * Indicates whether the response is an HTTP "ok" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  ok: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.statusType === 2;
    }
  },

  /**
   * Indicates whether the response is an HTTP "client error" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  clientError: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.statusType === 4;
    }
  },

  /**
   * Indicates whether the response is an HTTP "server error" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  serverError: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.statusType === 5;
    }
  },

  /**
   * Indicates whether the response is an HTTP error status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  error: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.clientError || this.serverError;
    }
  },

  /**
   * Indicates whether the response is an HTTP "accepted" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  accepted: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.status === 202;
    }
  },

  /**
   * Indicates whether the response is an HTTP "no content" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  noContent: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.status === 204 || this.status === 1223;
    }
  },

  /**
   * Indicates whether the response is an HTTP "bad request" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  badRequest: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.status === 400;
    }
  },

  /**
   * Indicates whether the response is an HTTP "unauthorized" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  unauthorized: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.status === 401;
    }
  },

  /**
   * Indicates whether the response is an HTTP "not acceptable" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  notAcceptable: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.status === 406;
    }
  },

  /**
   * Indicates whether the response is an HTTP "not found" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  notFound: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.status === 404;
    }
  },

  /**
   * Indicates whether the response is an HTTP "forbidden" status
   *
   * https://visionmedia.github.io/superagent/#response-status
   *
   * @type {boolean}
   */
  forbidden: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.status === 403;
    }
  },


  /**
   * Returns the value of the given header.  Header names are case insensitive.
   *
   * https://visionmedia.github.io/superagent/#response-content-type
   *
   * @param {string} name
   * @returns {?string}
   */
  getHeader: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function(name) {
      name = name.toLowerCase();
      return getPostman().getResponseHeader(name) || this.header[name];
    }
  },

  /**
   * Returns the value of the given cookie.
   *
   * @param {string} name
   * @returns {?string}
   */
  getCookie: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function(name) {
      return getPostman().getResponseCookie(name);
    }
  },
});


/**
 * Returns the `postman` global, or a proxy
 */
function getPostman() {
  return typeof postman === 'object' ? postman : postmanProxy;
}

var postmanProxy = {
  getEnvironmentVariable: function() {},
  setEnvironmentVariable: function() {},
  getGlobalVariable: function() {},
  setGlobalVariable: function() {},
  getResponseHeader: function() {},
  getResponseCookie: function() {},
};
