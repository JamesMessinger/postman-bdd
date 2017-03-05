'use strict';

/**
 * HTTP status codes by category
 */
module.exports = {
  /**
   * HTTP status codes that are considered to be redirects
   */
  redirect: [301, 302, 303, 307, 308],

  /**
   * HTTP status codes that are NOT considered to be redirects
   */
  nonRedirect: [200, 201, 400, 404, 500],
};
