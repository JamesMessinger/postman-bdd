'use strict';

var isIP = require('is-ip');
var url = require('url');
var cookies = require('./cookies');

var contentTypes = {
  json: 'application/json',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml',
};

module.exports = chaiHttp;

/**
 * This module is based on chai-http
 *
 * Copyright(c) 2011-2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * @see {@link https://github.com/chaijs/chai-http}
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
    var type = this._obj.method ? 'request' : 'response';

    this.assert(
      Object.keys(this._obj.headers || {}).length > 0,
      'expected the ' + type + ' to have headers',
      'expected the ' + type + ' to not have any headers'
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
    var status = this._obj.status;

    this.assert(
      wasRedirected(this._obj),
      'expected redirect status code but got ' + status,
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
    var isARedirect = wasRedirected(this._obj);
    var status = this._obj.status;
    var location = getHeader(this._obj, 'location');

    if (redirects && redirects.length) {
      this.assert(
        redirects.indexOf(destination) > -1,
        'expected redirect to ' + destination + ' but got ' + redirects.join(' then '),
        'expected not to redirect to ' + destination + ' but got ' + redirects.join(' then ')
      );
    }
    else {
      this.assert(
        isARedirect && location === destination,
        'expected redirect to #{exp} but got #{act}',
        'expected not to redirect to #{exp}',
        destination,
        isARedirect ? location : status
      );
    }
  });

  /**
   * Assert that a `Response` or `Request` object has query string parameters.
   *
   * @example:
   * expect(req).to.have.params;
   *
   * @name params
   */
  Assertion.addProperty('params', function () {
    var params = url.parse(this._obj.url, true).query;

    this.assert(
      Object.keys(params).length > 0,
      'expected the request to have query parameters',
      'expected the request to not have any query parameters'
    );
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
    var params = url.parse(this._obj.url, true).query;
    var param = params[name];
    var paramExists = param !== undefined && param !== null;

    if (arguments.length < 2) {
      this.assert(
        paramExists,
        'expected query parameter #{exp} to exist',
        'expected query parameter #{exp} to not exist',
        name,
        param
      );
    }
    else if (value instanceof RegExp) {
      this.assert(
        paramExists && value.test(param),
        "expected query parameter '" + name + "' to match #{exp} but got #{act}",
        "expected query parameter '" + name + "' to not match #{exp} but got #{act}",
        value,
        paramExists ? param : '<parameter-does-not-exist>'
      );
    }
    else {
      this.assert(
        paramExists && param === value,
        "expected query parameter '" + name + "' to have value #{exp} but got #{act}",
        "expected query parameter '" + name + "' to not have value #{exp}",
        value,
        paramExists ? param : '<parameter-does-not-exist>'
      );
    }
  });

  /**
   * Assert that a `Response` or `Request` object has cookies.
   *
   * @example:
   * expect(req).to.have.cookies;
   *
   * @name cookies
   */
  Assertion.addProperty('cookies', function () {
    var type = this._obj.method ? 'request' : 'response';
    var allCookies = getCookies(this._obj);

    this.assert(
      allCookies.length > 0,
      'expected the ' + type + ' to have cookies',
      'expected the ' + type + ' to not have any cookies'
    );
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
  Assertion.addMethod('cookie', function (name, value) {
    var cookie = getCookie(this._obj, name) || {};
    var cookieExists = cookie.value !== undefined && cookie.value !== null;

    if (arguments.length < 2) {
      this.assert(
        cookieExists,
        'expected cookie #{exp} to exist',
        'expected cookie #{exp} to not exist',
        name,
        cookie.value
      );
    }
    else if (value instanceof RegExp) {
      this.assert(
        cookieExists && value.test(cookie.value),
        "expected cookie '" + name + "' to match #{exp} but got #{act}",
        "expected cookie '" + name + "' to not match #{exp} but got #{act}",
        value,
        cookieExists ? cookie.value : '<cookie-not-set>'
      );
    }
    else {
      this.assert(
        cookieExists && cookie.value === value,
        "expected cookie '" + name + "' to have value #{exp} but got #{act}",
        "expected cookie '" + name + "' to not have value #{exp}",
        value,
        cookieExists ? cookie.value : '<cookie-not-set>'
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
    var negate = _.flag(this, 'negate');

    if ((valid && negate) || (!valid && !negate)) {
      var dataPath = tv4.error.dataPath;
      var schemaPath = tv4.error.schemaPath;
      var message = tv4.error.message;

      if (dataPath) {
        var propPath = dataPath.substr(1).split('/').join('.');
        message = propPath + ' is invalid. ' + message;
      }

      var error = new SyntaxError(message);
      error.dataPath = dataPath;
      error.schemaPath = schemaPath;
      throw error;
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
  // superAgent.Response object
  if (obj.getHeader) {
    return obj.getHeader(key);
  }

  // Postman `request` object
  key = (key || '').toLowerCase();
  var keys = Object.keys(obj.headers);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === key) {
      return obj.headers[keys[i]];
    }
  }
}

/**
 * Returns ALL cookies from a `Request` or `Response` object.
 *
 * @param {Request|Response} object
 * @returns {object[]}
 */
function getCookies (obj) {
  // superAgent.Response` object
  if (obj.cookies) {
    return obj.cookies;
  }

  // Postman `request` object
  var header = getHeader(obj, 'cookie');
  return cookies.parseRequestCookies(header);
}

/**
 * Returns a cookie from `Request` or `Response` object.
 *
 * @param {Request|Response} object
 * @param {String} name
 * @returns {String|Undefined}
 */
function getCookie (obj, name) {
  // superAgent.Response object
  if (obj.getCookie) {
    return obj.getCookie(name);
  }

  // Postman `request` object
  var allCookies = getCookies(obj);
  return cookies.getCookie(allCookies, name);
}

/**
 * Determines whether a `Request` or `Response` object has been redirected.
 *
 * @param {Request|Response} object
 * @returns {Boolean}
 */
function wasRedirected (obj) {
  var redirectCodes = [301, 302, 303, 307, 308];
  var redirects = obj.redirects;
  var status = obj.status;

  return redirectCodes.indexOf(status) >= 0 || redirects && redirects.length;
}
