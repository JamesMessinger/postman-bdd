/**
 * This module is based on chai-http
 * https://github.com/chaijs/chai-http
 *
 * Copyright(c) 2011-2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
'use strict';

var isIP = require('is-ip');
var qs = require('qs');
var url = require('url');
var Cookie = require('cookiejar');

module.exports = function(chai, _) {
  var Assertion = chai.Assertion;

  var contentTypes = {
    json: 'application/json',
    text: 'text/plain',
    html: 'text/html',
  };

  /**
   * Return a header from `Request` or `Response` object.
   *
   * @param {Request|Response} object
   * @param {String} Header
   * @returns {String|Undefined}
   */
  function getHeader(obj, key) {
    if (key) key = key.toLowerCase();
    if (obj.headers) return obj.headers[key];
    if (obj.getHeader) return obj.getHeader(key);
  }

  /**
   * Returns a cookie from `Request` or `Response` object.
   *
   * @param {Request|Response} object
   * @param {String} Cookie
   * @returns {String|Undefined}
   */
  function getCookie(obj, key) {
    if (obj.getCookie) return obj.getCookie(key);

    var header = getHeader(this._obj, 'set-cookie');

    if (!header) {
      header = (getHeader(this._obj, 'cookie') || '').split(';');
    }

    /* eslint new-cap: 0 */
    var cookie = Cookie.CookieJar();
    cookie.setCookies(header);
    return cookie.getCookie(key, new Cookie.CookieAccessInfo());
  }

  /**
   * Assert that a response has a supplied status.
   *
   * @example
   * expect(res).to.have.status(200);
   *
   * @param {Number} status number
   * @name status
   */
  Assertion.addMethod('status', function(code) {
    new Assertion(this._obj).to.have.property('status');
    var status = this._obj.status;

    this.assert(
      status === code,
      'expected #{this} to have status code #{exp} but got #{act}',
      'expected #{this} to not have status code #{act}',
      code,
      status
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
   * @api public
   */
  Assertion.addMethod('header', function(key, value) {
    var header = getHeader(this._obj, key);

    if (arguments.length < 2) {
      this.assert(
        typeof header !== 'undefined' || header === null,
        'expected header \'' + key + '\' to exist',
        'expected header \'' + key + '\' to not exist'
      );
    }
    else if (value instanceof RegExp) {
      this.assert(
        value.test(header),
        'expected header \'' + key + '\' to match ' + value + ' but got ' + _.inspect(header),
        'expected header \'' + key + '\' not to match ' + value + ' but got ' + _.inspect(header),
        value,
        header
      );
    }
    else {
      this.assert(
        header === value,
        'expected header \'' + key + '\' to have value ' + value + ' but got ' + _.inspect(header),
        'expected header \'' + key + '\' to not have value ' + value,
        value,
        header
      );
    }
  });

  /**
   * Assert that a `Response` or `Request` object has headers.
   *
   * @example:
   * expect(req).to.have.headers;
   *
   * @name headers
   * @api public
   */
  Assertion.addProperty('headers', function() {
    this.assert(
      Object.keys(this._obj.headers).length > 0,
      'expected #{this} to have headers or getHeader method',
      'expected #{this} to not have headers or getHeader method'
    );
  });

  /**
   * Assert that a string represents valid ip address.
   *
   * @example:
   * expect('127.0.0.1').to.be.an.ip;
   * expect('2001:0db8:85a3:0000:0000:8a2e:0370:7334').to.be.an.ip;
   *
   * @name ip
   * @api public
   */
  Assertion.addProperty('ip', function() {
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
   * @api public
   */
  function checkContentType(name) {
    var val = contentTypes[name];

    Assertion.addProperty(name, function() {
      new Assertion(this._obj).to.have.headers;
      var ct = getHeader(this._obj, 'content-type');
      var ins = _.inspect(ct) === 'undefined' ? 'headers' : _.inspect(ct);

      this.assert(
        ct && ct.indexOf(val) >= 0,
        'expected ' + ins + ' to include \'' + val + '\'',
        'expected ' + ins + ' to not include \'' + val + '\''
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
   * @api public
   */
  Assertion.addProperty('redirect', function() {
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
   * @api public
   */

  Assertion.addMethod('redirectTo', function(destination) {
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
   * @api public
   */
  Assertion.addMethod('param', function(name, value) {
    var assertion = new Assertion();
    _.transferFlags(this, assertion);
    assertion._obj = qs.parse(url.parse(this._obj.url).query);
    assertion.property.apply(assertion, arguments);
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
   * @name param
   * @api public
   */
  Assertion.addMethod('cookie', function(key, value) {
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
};
