'use strict';

var CookieJar = require('cookiejar').CookieJar;
var CookieAccessInfo = require('cookiejar').CookieAccessInfo;

module.exports = {
  /**
   * Returns the cookie with the specified name from an array of cookies.
   *
   * @param {object[]} allCookies
   * @param {string} name
   * @returns {object|undefined}
   */
  getCookie: function (allCookies, name) {
    name = (name || '').toLowerCase();

    var foundCookie = allCookies.find(function (cookie) {
      return cookie && cookie.name.toLowerCase() === name;
    });

    return foundCookie;
  },

  /**
   * Parses a "Cookie" header and returns an array of cookie objects.
   *
   * @param {string} [header]
   * @returns {object[]}
   */
  parseRequestCookies: function (header) {
    var cookieJar = new CookieJar();

    if (header) {
      var cookies = header
        .split(';')
        .map(function (cookie) {
          return cookie.trim();
        });

      cookieJar.setCookies(cookies);
    }

    var allCookies = cookieJar.getCookies(CookieAccessInfo.All);
    return allCookies;
  },

  /**
   * Parses one or more "Set-Cookie" headers and returns an array of cookie objects.
   *
   * @param {string|string[]} [headers] - The value of the "Set-Cookie" header(s)
   * @returns {object[]}
   */
  parseResponseCookies: function (headers) {
    var cookieJar = new CookieJar();

    if (headers) {
      // The `setCookies` method supports a string or array of strings
      cookieJar.setCookies(headers);
    }

    var allCookies = cookieJar.getCookies(CookieAccessInfo.All);
    return allCookies;
  },
};
