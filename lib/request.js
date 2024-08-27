/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

const accepts = require('accepts');
const deprecate = require('depd')('express');
const isIP = require('net').isIP;
const typeis = require('type-is');
const http = require('http');
const fresh = require('fresh');
const parseRange = require('range-parser');
const parse = require('parseurl');
const proxyaddr = require('proxy-addr');

/**
 * Request prototype.
 * @public
 */

const req = Object.create(http.IncomingMessage.prototype)

/**
 * Module exports.
 * @public
 */

module.exports = req

/**
 * Return the value of the specified request header.
 *
 * The `Referrer` header field is special-cased;
 * both `Referrer` and `Referer` are treated as interchangeable.
 *
 * Examples:
 *
 *     req.get('Content-Type');
 *     // => "text/plain"
 *
 *     req.get('content-type');
 *     // => "text/plain"
 *
 *     req.get('Something');
 *     // => undefined
 *
 * Aliased as `req.header()`.
 *
 * @param {String} name - The name of the header to retrieve.
 * @return {String|undefined} - The value of the header if found, otherwise undefined.
 * @throws {TypeError} If the `name` argument is not provided or not a string.
 * @public
 */

req.get =
req.header = function header(name) {
  if (!name) {
    throw new TypeError('name argument is required to req.get');
  }

  if (typeof name !== 'string') {
    throw new TypeError('name must be a string to req.get');
  }

  const lcName = name.toLowerCase();
  const headers = this.headers;

  if (lcName === 'referer' || lcName === 'referrer') {
    return headers.referrer || headers.referer;
  }

  return headers[lcName];
};

/**
 * Determines if the specified MIME type(s) are acceptable based on the request's `Accept` header.
 * Returns the best match if a type is acceptable; otherwise, returns `undefined`.
 * If no acceptable type is found, the server should respond with a 406 "Not Acceptable".
 *
 * The `type` argument can be a:
 * - Single MIME type string (e.g., "application/json")
 * - Extension name (e.g., "json")
 * - Comma-delimited list of types (e.g., "json, html, text/plain")
 * - Argument list (e.g., `"json", "html", "text/plain"`)
 * - Array of types (e.g., `["json", "html", "text/plain"]`)
 *
 * The function returns the best match if any is found, otherwise `undefined`.
 *
 * Examples:
 *
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => "html"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('html');
 *     // => "html"
 *     req.accepts('text/html');
 *     // => "text/html"
 *     req.accepts('json, text');
 *     // => "json"
 *     req.accepts('application/json');
 *     // => "application/json"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('image/png');
 *     req.accepts('png');
 *     // => undefined
 *
 *     // Accept: text/*;q=.5, application/json
 *     req.accepts(['html', 'json']);
 *     req.accepts('html', 'json');
 *     req.accepts('html, json');
 *     // => "json"
 *
 * @param {String|Array} types - A single type, list of types, or array of types to check against the `Accept` header.
 * @return {String|undefined} - The best matching type, or `undefined` if no match is found.
 * @public
 */

req.accepts = function(...types) {
  // Create an instance of `accepts` to process the request's `Accept` header.
  const accept = accepts(this);

  // Determine and return the best matching type.
  return accept.types(...types);
};

/**
 * Checks if the specified `encoding`s are accepted based on the request's `Accept-Encoding` header.
 * Returns the best matching encoding or an array of acceptable encodings.
 *
 * The `encoding` argument(s) can be:
 * - A single encoding string (e.g., "gzip")
 * - Multiple encoding strings as arguments (e.g., `"gzip", "deflate"`)
 * - A comma-delimited list of encodings (e.g., `"gzip, deflate"`)
 *
 * Examples:
 *
 *     // Accept-Encoding: gzip, deflate
 *     req.acceptsEncodings('gzip');
 *     // => "gzip"
 *
 *     req.acceptsEncodings('gzip', 'deflate');
 *     // => "gzip"
 *
 *     req.acceptsEncodings('br');
 *     // => undefined
 *
 *     req.acceptsEncodings('gzip, br');
 *     // => "gzip"
 *
 * @param {...String} encodings - The encoding(s) to check against the `Accept-Encoding` header.
 * @return {String|Array} - The best matching encoding, or an array of acceptable encodings.
 * @public
 */

req.acceptsEncodings = function(...encodings) {
  const accept = accepts(this);
  return accept.encodings(...encodings);
};

/**
 * Deprecated: Use `req.acceptsEncodings` instead.
 * 
 * @deprecated Use `req.acceptsEncodings` for checking accepted encodings.
 */
req.acceptsEncoding = deprecate.function(req.acceptsEncodings,
  'req.acceptsEncoding: Use req.acceptsEncodings instead');

/**
 * Checks if the specified `charset`s are acceptable based on the request's `Accept-Charset` header.
 * Returns the best matching charset or an array of acceptable charsets.
 *
 * The `charset` argument(s) can be:
 * - A single charset string (e.g., "utf-8")
 * - Multiple charset strings as arguments (e.g., `"utf-8", "iso-8859-1"`)
 * - A comma-delimited list of charsets (e.g., `"utf-8, iso-8859-1"`)
 *
 * Examples:
 *
 *     // Accept-Charset: utf-8, iso-8859-1
 *     req.acceptsCharsets('utf-8');
 *     // => "utf-8"
 *
 *     req.acceptsCharsets('utf-8', 'iso-8859-1');
 *     // => "utf-8"
 *
 *     req.acceptsCharsets('utf-16');
 *     // => undefined
 *
 *     req.acceptsCharsets('utf-8, utf-16');
 *     // => "utf-8"
 *
 * @param {...String} charsets - The charset(s) to check against the `Accept-Charset` header.
 * @return {String|Array} - The best matching charset, or an array of acceptable charsets.
 * @public
 */

req.acceptsCharsets = function(...charsets) {
  const accept = accepts(this);
  return accept.charsets(...charsets);
};

/**
 * Deprecated: Use `req.acceptsCharsets` instead.
 * 
 * @deprecated Use `req.acceptsCharsets` for checking accepted charsets.
 */
req.acceptsCharset = deprecate.function(req.acceptsCharsets,
  'req.acceptsCharset: Use req.acceptsCharsets instead');

/**
 * Checks if the specified `lang`s (languages) are acceptable based on the request's `Accept-Language` header.
 * Returns the best matching language or an array of acceptable languages.
 *
 * The `lang` argument(s) can be:
 * - A single language string (e.g., "en", "fr")
 * - Multiple language strings as arguments (e.g., `"en", "fr", "es"`)
 * - A comma-delimited list of languages (e.g., `"en, fr, es"`)
 *
 * Examples:
 *
 *     // Accept-Language: en, fr;q=0.8, es;q=0.6
 *     req.acceptsLanguages('en');
 *     // => "en"
 *
 *     req.acceptsLanguages('fr', 'es');
 *     // => "fr"
 *
 *     req.acceptsLanguages('de');
 *     // => undefined
 *
 *     req.acceptsLanguages('fr, en');
 *     // => "en"
 *
 * @param {...String} langs - The language(s) to check against the `Accept-Language` header.
 * @return {String|Array} - The best matching language, or an array of acceptable languages.
 * @public
 */

req.acceptsLanguages = function(...langs) {
  const accept = accepts(this);
  return accept.languages(...langs);
};

/**
 * Deprecated: Use `req.acceptsLanguages` instead.
 * 
 * @deprecated Use `req.acceptsLanguages` for checking accepted languages.
 */
req.acceptsLanguage = deprecate.function(req.acceptsLanguages,
  'req.acceptsLanguage: Use req.acceptsLanguages instead');

/**
 * Parses the `Range` header field, capping the ranges to the specified `size`.
 * 
 * This function is used to handle partial content requests, typically for serving
 * byte ranges in response to a `Range` header. It supports combining overlapping
 * and adjacent ranges if the `combine` option is set to `true`.
 *
 * Return values:
 * - `undefined`: If the `Range` header is not present.
 * - `-1`: If the range is unsatisfiable (i.e., it doesn't match the resource size).
 * - `-2`: If the range is syntactically invalid.
 * - Array of ranges: If the range is valid and satisfiable. Each element in the array
 *   is an object with `start` and `end` properties, representing the range of bytes.
 *   The array also has a `type` property indicating the type of range (commonly "bytes").
 *
 * Example usage:
 * 
 *     // Range: bytes=0-499
 *     req.range(1000);
 *     // => [{ start: 0, end: 499, type: 'bytes' }]
 * 
 *     // Range: bytes=500-999,0-499
 *     req.range(1000, { combine: true });
 *     // => [{ start: 0, end: 999, type: 'bytes' }]
 * 
 * @param {number} size - The total size of the resource (e.g., the length of a file in bytes).
 * @param {object} [options] - Optional settings.
 * @param {boolean} [options.combine=false] - Whether to combine overlapping and adjacent ranges.
 * @return {number|array} - The parsed range(s), or a special value indicating an error.
 * @public
 */

req.range = function range(size, options = {}) {
  const rangeHeader = this.get('Range');
  if (!rangeHeader) return undefined;

  return parseRange(size, rangeHeader, options);
};

/**
 * Retrieve the value of a parameter from the route, request body, or query string.
 *
 * This method looks for the parameter in the following order:
 * 1. Route placeholders (e.g., `/user/:id`).
 * 2. Request body (e.g., `{ "id": 12 }`).
 * 3. Query string (e.g., `?id=12`).
 *
 * It is recommended to use `req.params`, `req.body`, or `req.query` directly 
 * for accessing parameters, as this method is deprecated.
 *
 * Example usage:
 * 
 *     // Route: /user/12
 *     req.param('id');
 *     // => 12
 * 
 *     // Request body: { "id": 12 }
 *     req.param('id');
 *     // => 12
 * 
 *     // Query string: ?id=12
 *     req.param('id');
 *     // => 12
 * 
 * @param {String} name - The name of the parameter to retrieve.
 * @param {any} [defaultValue] - The value to return if the parameter is not found. Defaults to `undefined`.
 * @return {any} - The value of the parameter or `defaultValue` if the parameter is not found.
 * @deprecated Use `req.params`, `req.body`, or `req.query` directly instead.
 * @public
 */

req.param = function param(name, defaultValue) {
  const params = this.params || {};
  const body = this.body || {};
  const query = this.query || {};

  deprecate('req.param(name, defaultValue): Use req.params, req.body, or req.query instead');

  if (name in params) return params[name];
  if (name in body) return body[name];
  if (name in query) return query[name];

  return defaultValue;
};

/**
 * Check if the incoming request's "Content-Type" header matches the given MIME type(s).
 *
 * This method checks if the `Content-Type` header of the request matches any of the 
 * specified MIME types. It supports both individual MIME type strings and arrays 
 * of MIME types. The method can handle flattened arguments for flexibility.
 *
 * Example usage:
 *
 *     // With Content-Type: text/html; charset=utf-8
 *     req.is('html');          // => true
 *     req.is('text/html');     // => true
 *     req.is('text/*');        // => true
 *
 *     // When Content-Type is application/json
 *     req.is('json');          // => true
 *     req.is('application/json'); // => true
 *     req.is('application/*');    // => true
 *
 *     // When Content-Type is application/json
 *     req.is('html');          // => false
 *
 * @param {String|Array} types - A MIME type string or an array of MIME types to check against.
 * @return {String|false|null} - The matched MIME type if any, otherwise `false` if no match is found, or `null` if no `Content-Type` header is present.
 * @public
 */

req.is = function is(types) {
  // Convert single argument to array if not already an array
  const arr = Array.isArray(types) ? types : Array.from(arguments);

  // Check Content-Type header against the given MIME types
  return typeis(this, arr);
};

/**
 * Return the protocol string ("http" or "https") based on the request.
 *
 * The protocol is determined as follows:
 * - If the connection is encrypted (`this.connection.encrypted` is true), the protocol is "https".
 * - Otherwise, it defaults to "http".
 * - If the application is configured to trust proxy headers (as determined by the "trust proxy" setting),
 *   the `X-Forwarded-Proto` header will be used to determine the protocol, if present.
 *
 * This is particularly useful when running behind a reverse proxy that terminates TLS connections and 
 * forwards requests to your application.
 *
 * @return {String} - The protocol string, either "http" or "https".
 * @public
 */

defineGetter(req, 'protocol', function protocol() {
  // Default to "https" if the connection is encrypted, otherwise "http"
  let proto = this.connection.encrypted ? 'https' : 'http';

  // Check if the "trust proxy" setting trusts the socket address
  const trustProxyFn = this.app.get('trust proxy fn');
  
  // If the proxy function trusts the connection, use "X-Forwarded-Proto"
  if (trustProxyFn(this.connection.remoteAddress, 0)) {
    const header = this.get('X-Forwarded-Proto') || proto;
    const commaIndex = header.indexOf(',');

    // Handle multiple values in the "X-Forwarded-Proto" header
    return commaIndex !== -1
      ? header.substring(0, commaIndex).trim()
      : header.trim();
  }

  return proto;
});

/**
 * Short-hand for checking if the request is secure (i.e., if it's using HTTPS).
 *
 * This is equivalent to:
 *    req.protocol === 'https'
 *
 * @return {Boolean} - `true` if the request is secure (HTTPS), otherwise `false`.
 * @public
 */
defineGetter(req, 'secure', function secure() {
  return this.protocol === 'https';
});

/**
 * Return the remote address of the client from the trusted proxy.
 *
 * If the "trust proxy" setting is configured, this will return the remote address
 * from the trusted proxy list. Otherwise, it returns the remote address of the socket.
 *
 * @return {String} - The remote address of the client.
 * @public
 */
defineGetter(req, 'ip', function ip() {
  const trust = this.app.get('trust proxy fn');
  return proxyaddr(this, trust);
});

/**
 * Return an array of trusted proxy addresses and the client IP.
 *
 * When "trust proxy" is enabled, this returns an array of IP addresses where the
 * trusted proxies are listed, followed by the client IP. The array is sorted from
 * the furthest down-stream proxy to the closest, with the socket address removed.
 *
 * Example:
 *   If "trust proxy" is set to "client, proxy1, proxy2", the result might be:
 *   ["client", "proxy1", "proxy2"]
 *
 * @return {Array} - An array of IP addresses, from the furthest to the closest proxy.
 * @public
 */
defineGetter(req, 'ips', function ips() {
  const trust = this.app.get('trust proxy fn');
  const addrs = proxyaddr.all(this, trust);

  // Reverse the order (furthest -> closest) and remove the socket address
  addrs.reverse().pop();

  return addrs;
});

/**
 * Return subdomains as an array.
 *
 * Subdomains are the dot-separated parts of the host before the main domain of
 * the app. By default, the domain of the app is assumed to be the last two
 * parts of the host. This can be changed by setting "subdomain offset".
 *
 * For example, if the domain is "tobi.ferrets.example.com":
 * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
 * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
 *
 * @return {Array}
 * @public
 */

defineGetter(req, 'subdomains', function subdomains() {
  const hostname = this.hostname;

  if (!hostname) return [];

  const offset = this.app.get('subdomain offset');
  const subdomains = !isIP(hostname)
    ? hostname.split('.').reverse()
    : [hostname];

  return subdomains.slice(offset);
});

/**
 * Short-hand for `url.parse(req.url).pathname`.
 *
 * @return {String}
 * @public
 */

defineGetter(req, 'path', function path() {
  return parse(this).pathname;
});

/**
 * Parse the "Host" header field to determine the hostname.
 *
 * When the "trust proxy" setting is enabled, the "X-Forwarded-Host" header field
 * will be used if present and trusted.
 *
 * - If the "X-Forwarded-Host" header contains multiple values, only the first value is used.
 * - If the "X-Forwarded-Host" header is not present or not trusted, the "Host" header is used.
 *
 * The returned hostname excludes the port number if present, and it supports IPv6 literals.
 *
 * @return {String|undefined} - The parsed hostname, or `undefined` if not available.
 * @public
 */
defineGetter(req, 'hostname', function hostname() {
  const trust = this.app.get('trust proxy fn');
  let host = this.get('X-Forwarded-Host');

  if (!host || !trust(this.connection.remoteAddress, 0)) {
    host = this.get('Host');
  } else if (host.includes(',')) {
    // Only use the first value if multiple are present
    host = host.split(',')[0].trim();
  }

  if (!host) return;

  // IPv6 literal support
  const isIPv6 = host.startsWith('[');
  const offset = isIPv6 ? host.indexOf(']') + 1 : 0;
  const index = host.indexOf(':', offset);

  return index !== -1
    ? host.substring(0, index)
    : host;
});

// TODO: change req.host to return host in next major

defineGetter(req, 'host', deprecate.function(function host(){
  return this.hostname;
}, 'req.host: Use req.hostname instead'));

/**
 * Check if the request is fresh, aka
 * Last-Modified and/or the ETag
 * still match.
 *
 * @return {Boolean}
 * @public
 */

defineGetter(req, 'fresh', function(){
  const method = this.method;
  const res = this.res
  const status = res.statusCode

  // GET or HEAD for weak freshness validation only
  if ('GET' !== method && 'HEAD' !== method) return false;

  // 2xx or 304 as per rfc2616 14.26
  if ((status >= 200 && status < 300) || 304 === status) {
    return fresh(this.headers, {
      'etag': res.get('ETag'),
      'last-modified': res.get('Last-Modified')
    })
  }

  return false;
});

/**
 * Check if the request is stale, aka
 * "Last-Modified" and / or the "ETag" for the
 * resource has changed.
 *
 * @return {Boolean}
 * @public
 */

defineGetter(req, 'stale', function stale(){
  return !this.fresh;
});

/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @public
 */

defineGetter(req, 'xhr', function xhr(){
  const val = this.get('X-Requested-With') || '';
  return val.toLowerCase() === 'xmlhttprequest';
});

/**
 * Helper function for creating a getter on an object.
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Function} getter
 * @private
 */
function defineGetter(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
}
