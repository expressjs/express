/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @api private
 */

var Buffer = require('node:buffer').Buffer
var contentType = require('content-type');
var etag = require('etag');
var mime = require('mime-types')
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');

/**
 * Return strong ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.etag = createETagGenerator({ weak: false })

/**
 * Return weak ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.wetag = createETagGenerator({ weak: true })

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */

exports.normalizeType = function(type) {
  return type.includes('/')
    ? acceptParams(type)
    : { value: mime.lookup(type) || 'application/octet-stream', params: {} };
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */

exports.normalizeTypes = function(types) {
  const len = types.length;
  const ret = new Array(len);

  for (let i = 0; i < len; i++) {
    ret[i] = exports.normalizeType(types[i]);
  }

  return ret;
}

/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function acceptParams(str) {
  const parts = str.split(/ *; */);
  const ret = { value: parts[0], quality: 1, params: {} };

  for (let i = 1; i < parts.length; i++) {
    const [key, value] = parts[i].split(/ *= */);
    if (key === 'q') {
      ret.quality = parseFloat(value);
    } else {
      ret.params[key] = value;
    }
  }

  return ret;
}

/**
 * Compile "etag" value to function.
 *
 * @param  {Boolean|String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileETag = function(val) {
  if (typeof val === 'function') {
    return val;
  }

  if (val === false) {
    return;
  }

  switch (val) {
    case true:
    case 'weak':
      return exports.wetag;
    case 'strong':
      return exports.etag;
    default:
      throw new TypeError(`unknown value for etag function: ${val}`);
  }
}

/**
 * Compile "query parser" value to function.
 *
 * @param  {String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileQueryParser = function (val) {
  if (typeof val === 'function') {
    return val;
  }

  if (val === false) {
    return;
  }

  switch (val) {
    case true:
    case 'simple':
      return querystring.parse;
    case 'extended':
      return parseExtendedQueryString;
    default:
      throw new TypeError(`unknown value for query parser function: ${val}`);
  }
}

/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */

exports.compileTrust = function(val) {
  if (typeof val === 'function') return val;

  if (val === true) {
    // Support plain true/false
    return function(){ return true };
  }

  if (typeof val === 'number') {
    // Support trusting hop count
    return function(a, i){ return i < val };
  }

  if (typeof val === 'string') {
    // Support comma-separated values
    val = val.split(',')
      .map(function (v) { return v.trim() })
  }

  return proxyaddr.compile(val || []);
}

/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */

exports.setCharset = function setCharset(type, charset) {
  if (!type || !charset) {
    return type;
  }

  // parse type
  var parsed = contentType.parse(type);

  // set charset
  parsed.parameters.charset = charset;

  // format type
  return contentType.format(parsed);
};

/**
 * Create an ETag generator function, generating ETags with
 * the given options.
 *
 * @param {object} options
 * @return {function}
 * @private
 */

function createETagGenerator(options) {
  return (body, encoding) => {
    const buf = Buffer.isBuffer(body)
      ? body
      : Buffer.from(body, encoding);

    return etag(buf, options);
  };
}


/**
 * Parse an extended query string with qs.
 *
 * @param {String} str
 * @return {Object}
 * @private
 */

function parseExtendedQueryString(str) {
  return qs.parse(str, {
    allowPrototypes: true
  });
}
