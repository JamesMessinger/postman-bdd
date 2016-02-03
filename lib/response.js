module.exports = Response;

/**
 * Maps Postman's response data to SuperAgent's response API
 *
 * For more info, see:
 * https://visionmedia.github.io/superagent/#response-properties
 */
function Response() {
  this.text = getText();
  this.body = getBody();
  this.header = getHeaders();
  this.time = getTime();
  this.status = getStatus();
  this.statusType = getStatusType();

  // https://visionmedia.github.io/superagent/#response-status
  this.info = this.statusType === 1;
  this.ok = this.statusType === 2;
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

  // https://visionmedia.github.io/superagent/#response-content-type
  var contentType = this.getHeader('content-type') || '';
  this.type = getType(contentType);
  this.charset = getCharset(contentType);
}

/**
 * Returns the value of the given header.  Header names are case insensitive.
 */
Response.prototype.getHeader = function(name) {
  name = name.toLowerCase();
  return getPostman().getResponseHeader(name) || this.header[name];
};

/**
 * Returns the value of the given cookie.
 */
Response.prototype.getCookie = function(name) {
  return getPostman().getResponseCookie(name);
};

/**
 * Returns the unparsed response body string
 */
function getText() {
  return typeof responseBody === 'string' ? responseBody : '';
}

/**
 * The parsed response body.
 */
function getBody() {
  var text = getText();
  try {
    return JSON.parse(text);
  }
  catch (e) {
    return {};
  }
}

/**
 * The parsed response headers, with lowercased field names.
 */
function getHeaders() {
  return typeof responseHeaders === 'object' ? responseHeaders : {};
}

/**
 * The response time, in milliseconds
 */
function getTime() {
  return typeof responseTime === 'number' ? responseTime : 0;
}

/**
 * Returns the value of the Content-Type header without the charset
 */
function getType(contentType) {
  return contentType.split(';')[0];
}

/**
 * Returns the value of the Content-Type header without the charset
 */
function getCharset(contentType) {
  var match = /charset=([a-zA-Z0-9_-]+)/i.exec(contentType);
  if (!match) return '';
  return match[1];
}

/**
 * Returns the HTTP response status code
 */
function getStatus() {
  return typeof responseCode === 'object' ? responseCode.code : 0;
}

/**
 * Returns the HTTP response status type (1, 2, 3, 4, or 5)
 */
function getStatusType() {
  return Math.floor(getStatus() / 100);
}

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
