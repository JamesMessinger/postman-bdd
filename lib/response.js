'use strict';

var log = require('./log');
var cookies = require('./cookies');

module.exports = {
  /**
   * SuperAgent's Response API
   *
   * @see {@link https://visionmedia.github.io/superagent/#response-properties}
   */
  Response: Response
};

function Response () {
  /**
   * The HTTP response status code
   * @type {number}
   */
  this.status = typeof responseCode === 'object' ? responseCode.code : 0;

  /**
   * The HTTP response status type (1, 2, 3, 4, or 5)
   * @type {number}
   */
  this.statusType = Math.floor(this.status / 100);

  /**
   * Named properties for common HTTP status codes
   *
   * @see {@link https://visionmedia.github.io/superagent/#response-status}
   * @type {boolean}
   */
  this.info = this.statusType === 1;
  this.ok = this.statusType === 2;
  this.redirect = this.statusType === 3;
  this.clientError = this.statusType === 4;
  this.serverError = this.statusType === 5;
  this.error = this.clientError || this.serverError;
  this.accepted = this.status === 202;
  this.noContent = this.status === 204 || this.status === 1223;
  this.badRequest = this.status === 400;
  this.unauthorized = this.status === 401;
  this.notAcceptable = this.status === 406;
  this.notFound = this.status === 404;
  this.forbidden = this.status === 403;

  /**
   * The response time, in milliseconds
   * @type {number}
   */
  this.time = typeof responseTime === 'number' ? responseTime : 0;

  /**
   * The parsed response headers, with lowercased field names.
   *
   * NOTE: SuperAgent exposes this property as both `header` and `headers`
   *
   * @type {object}
   */
  this.headers = this.header = pojo(responseHeaders);

  var contentType = this.getHeader('content-type') || '';
  var charsetMatch = /charset=([a-zA-Z0-9_-]+)/i.exec(contentType);

  /**
   * The value of the Content-Type header without the charset (e.g. "text/html")
   * @type {string}
   */
  this.type = contentType.split(';')[0];

  /**
   * The value of the Content-Type header without the MIME type (e.g. "utf8")
   * @type {string}
   */
  this.charset = charsetMatch ? charsetMatch[1] : '';

  /**
   * The parsed response cookies.
   * @type {object[]}
   */
  this.cookies = parseCookies(this);

  /**
   * Returns the unparsed response body string
   * @type {string}
   */
  this.text = typeof responseBody === 'string' ? responseBody : '';

  /**
   * The parsed response body.
   * @type {object}
   */
  this.body = parseResponeBody(this);
}

/**
 * Returns the value of the given header.  Header names are case insensitive.
 *
 * @see {@link https://visionmedia.github.io/superagent/#response-content-type}
 * @param {string} name
 * @returns {?string}
 */
Response.prototype.getHeader = function (name) {
  if (typeof postman === 'object' && typeof postman.getResponseHeader === 'function') {
    return postman.getResponseHeader(name);
  }
  else {
    name = (name || '').toLowerCase();
    return this.headers[name];
  }
};

/**
 * Returns the value of the given cookie.
 *
 * @param {string} name
 * @returns {?string}
 */
Response.prototype.getCookie = function (name) {
  if (typeof postman === 'object' && typeof postman.getResponseCookie === 'function') {
    return postman.getResponseCookie(name);
  }
  else {
    return cookies.getCookie(this.cookies, name);
  }
};

/**
 * Returns the parsed "Set-Cookie" headers
 *
 * @param {Response} response
 * @returns {object[]}
 */
function parseCookies (response) {
  if (typeof responseCookies === 'object' && responseCookies.length > 0) {
    return responseCookies;
  }

  var header = response.getHeader('set-cookie');
  return cookies.parseResponseCookies(header);
}

/**
 * Parses the response body as JSON, XML, or plain-text
 *
 * @param {Response} response
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
      return pojo(xml2Json(response.text));
    }
    catch (err) {
      log.error('Unable to parse the response body as XML', log.errorToPOJO(err));
    }
  }

  // If all else fails, just return the response body as plain-text
  return response.text;
}

/**
 * Converts the given object to a POJO (plain-old JavaScript object).
 * This is necessary because many Postman objects don't inherit from the Object prototype,
 * which means that they can't be used with Chai.js `should` interface.
 *
 * @param {object} [obj]
 * @returns {object}
 */
function pojo (obj) {
  return JSON.parse(JSON.stringify(obj || {}));
}
