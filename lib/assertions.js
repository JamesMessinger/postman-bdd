'use strict';

var isIP = require('is-ip');
var qs = require('qs');
var url = require('url');
var Cookie = require('cookiejar');

var contentTypes = {
  json: 'application/json',
  text: 'text/plain',
  html: 'text/html',
};

module.exports = chaiHttp;

/**
 * This module is based on chai-http
 * https://github.com/chaijs/chai-http
 *
 * Copyright(c) 2011-2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
function chaiHttp (chai, _) {
  var Assertion = chai.Assertion;

  /**
   * Assert that a response has a supplied status.
   *
   * @example
   * expect(res).to.have.status(200);
   *
   * @param {Number} status number
   * @name status
   */
  Assertion.addMethod('status', function (code) {
    new Assertion(this._obj).to.have.property('status');
    var status = this._obj.status;

    this.assert(
      status === code,
      'expected the response to have status code #{exp} but got #{act}',
      'expected the response to not have status code #{act}',
      code,
      status
    );
  });

  /**
   * Assert that a `Response` or `Request` object has headers.
   *
   * @example:
   * expect(req).to.have.headers;
   *
   * @name headers
   */
  Assertion.addProperty('headers', function () {
    this.assert(
      Object.keys(this._obj.header || {}).length > 0,
      'expected the response to have headers',
      'expected the response to not have headers'
    );
  });

  /**
   * Assert that a `Response` or `Request` object has a header.
   * If a value is provided, equality to value will be asserted.
   * You may also pass a regular expression to check.
   *
   * @example:
   * expect(req).to.have.header('x-api-key');
   * expect(req).to.have.header('content-type', 'text/plain');
   * expect(req).to.have.header('content-type', /^text/);
   *
   * @param {String} header key (case insensitive)
   * @param {String|RegExp} header value (optional)
   * @name header
   */
  Assertion.addMethod('header', function (key, value) {
    var header = getHeader(this._obj, key);
    var headerExists = header !== undefined && header !== null;

    if (arguments.length < 2) {
      this.assert(
        headerExists,
        'expected header #{exp} to exist',
        'expected header #{exp} to not exist',
        key,
        header
      );
    }
    else if (value instanceof RegExp) {
      this.assert(
        headerExists && value.test(header),
        "expected header '" + key + "' to match #{exp} but got #{act}",
        "expected header '" + key + "' to not match #{exp} but got #{act}",
        value,
        headerExists ? header : '<header-not-set>'
      );
    }
    else {
      this.assert(
        headerExists && header === value,
        "expected header '" + key + "' to have value #{exp} but got #{act}",
        "expected header '" + key + "' to not have value #{exp}",
        value,
        headerExists ? header : '<header-not-set>'
      );
    }
  });

  /**
   * Assert that a string represents valid ip address.
   *
   * @example:
   * expect('127.0.0.1').to.be.an.ip;
   * expect('2001:0db8:85a3:0000:0000:8a2e:0370:7334').to.be.an.ip;
   *
   * @name ip
   */
  Assertion.addProperty('ip', function () {
    this.assert(
      isIP(this._obj),
      'expected #{this} to be an ip',
      'expected #{this} to not be an ip'
    );
  });

  /**
   * Assert that a `Response` or `Request` object has a given content-type.
   *
   * @example:
   * expect(req).to.be.json;
   * expect(req).to.be.html;
   * expect(req).to.be.text;
   *
   * @name json
   * @name html
   * @name text
   */
  function checkContentType (name) {
    var val = contentTypes[name];

    Assertion.addProperty(name, function () {
      var contentType = getHeader(this._obj, 'content-type');

      this.assert(
        contentType && contentType.indexOf(val) >= 0,
        'expected the response type to be #{exp} but got #{act}',
        'expected the response type to not be #{exp} (#{act})',
        name,
        contentType || '<content-type-not-set>'
      );
    });
  }

  Object
    .keys(contentTypes)
    .forEach(checkContentType);

  /**
   * Assert that a `Response` object has a redirect status code.
   *
   * @example:
   * expect(res).to.redirect;
   *
   * @name redirect
   */
  Assertion.addProperty('redirect', function () {
    var redirectCodes = [301, 302, 303];
    var status = this._obj.status;
    var redirects = this._obj.redirects;

    this.assert(
      redirectCodes.indexOf(status) >= 0 || redirects && redirects.length,
      'expected redirect with 30{1-3} status code but got ' + status,
      'expected not to redirect but got ' + status + ' status'
    );
  });

  /**
   * ### .redirectTo
   *
   * Assert that a `Response` object redirects to the supplied location.
   *
   * ```js
   * expect(res).to.redirectTo('http://example.com');
   * ```
   *
   * @param {String} location url
   * @name redirectTo
   */
  Assertion.addMethod('redirectTo', function (destination) {
    var redirects = this._obj.redirects;

    new Assertion(this._obj).to.redirect;

    if (redirects && redirects.length) {
      this.assert(
        redirects.indexOf(destination) > -1,
        'expected redirect to ' + destination + ' but got ' + redirects.join(' then '),
        'expected not to redirect to ' + destination + ' but got ' + redirects.join(' then ')
      );
    }
    else {
      var assertion = new Assertion(this._obj);
      _.transferFlags(this, assertion);
      assertion.with.header('location', destination);
    }
  });

  /**
   * Assert that a `Request` object has a query string parameter with a given
   * key, (optionally) equal to value
   *
   * @example:
   * expect(req).to.have.param('orderby');
   * expect(req).to.have.param('orderby', 'date');
   * expect(req).to.not.have.param('limit');
   *
   * @param {String} parameter name
   * @param {String} parameter value
   * @name param
   */
  Assertion.addMethod('param', function (name, value) {
    var assertion = new Assertion();
    _.transferFlags(this, assertion);
    assertion._obj = qs.parse(url.parse(this._obj.url).query);

    if (arguments.length === 1) {
      // Assert that query param exists
      assertion.property(name);
    }
    else {
      // Assert that the query param exists and has the specified value
      assertion.property(name, value);
    }
  });

  /**
   * Assert that a `Request` or `Response` object has a cookie header with a
   * given key, (optionally) equal to value
   *
   * @example:
   * expect(req).to.have.cookie('session_id');
   * expect(req).to.have.cookie('session_id', '1234');
   * expect(req).to.not.have.cookie('PHPSESSID');
   * expect(res).to.have.cookie('session_id');
   * expect(res).to.have.cookie('session_id', '1234');
   * expect(res).to.not.have.cookie('PHPSESSID');
   *
   * @param {String} parameter name
   * @param {String} parameter value
   * @name cookie
   */
  Assertion.addMethod('cookie', function (key, value) {
    var cookie = getCookie(this._obj, key);

    if (arguments.length === 2) {
      this.assert(
        cookie.value === value,
        'expected cookie \'' + key + '\' to have value #{exp} but got #{act}',
        'expected cookie \'' + key + '\' to not have value #{exp}',
        value,
        cookie.value
      );
    }
    else {
      this.assert(
        typeof cookie !== 'undefined' || cookie === null,
        'expected cookie \'' + key + '\' to exist',
        'expected cookie \'' + key + '\' to not exist'
      );
    }
  });

  /**
   * Asserts that the object matches the given JSON schema
   *
   * @example:
   * expect(req.body).to.have.scheam(myJsonSchema);
   *
   * @param {object} The JSON schema to validate against
   * @name schema
   */
  chai.Assertion.addMethod('schema', function (schema) {
    var valid = tv4.validate(this._obj, schema);
    if (!valid) {
      throw tv4.error;
    }
  });
}

/**
 * Return a header from `Request` or `Response` object.
 *
 * @param {Request|Response} object
 * @param {String} Header
 * @returns {String|Undefined}
 */
function getHeader (obj, key) {
  if (obj.getHeader) { return obj.getHeader(key); }

  key = (key || '').toLowerCase();
  var keys = Object.keys(obj.headers);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === key) {
      return obj.headers[keys[i]];
    }
  }
}

/**
 * Returns a cookie from `Request` or `Response` object.
 *
 * @param {Request|Response} object
 * @param {String} Cookie
 * @returns {String|Undefined}
 */
function getCookie (obj, key) {
  if (obj.getCookie) { return obj.getCookie(key); }

  var header = getHeader(obj, 'set-cookie');

  if (!header) {
    header = (getHeader(obj, 'cookie') || '').split(';');
  }

  /* eslint new-cap: 0 */
  var cookie = Cookie.CookieJar();
  cookie.setCookies(header);
  return cookie.getCookie(key, new Cookie.CookieAccessInfo());
}
