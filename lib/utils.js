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

var { METHODS } = require('node:http');
var contentType = require('content-type');
var etag = require('etag');
var mime = require('mime-types')
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('node:querystring');
const { Buffer } = require('node:buffer');


/**
 * A list of lowercased HTTP methods that are supported by Node.js.
 * @api private
 */
exports.methods = METHODS.map((method) => method.toLowerCase());

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
 * Return strong ETag for `body` including CORS headers.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @param {Object} [headers]
 * @return {String}
 * @api private
 */

exports.etagCors = createETagGenerator({
  weak: false,
  includeHeaders: ['access-control-allow-origin']
})

/**
 * Return weak ETag for `body` including CORS headers.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @param {Object} [headers]
 * @return {String}
 * @api private
 */

exports.wetagCors = createETagGenerator({
  weak: true,
  includeHeaders: ['access-control-allow-origin']
})

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */

exports.normalizeType = function(type){
  return ~type.indexOf('/')
    ? acceptParams(type)
    : { value: (mime.lookup(type) || 'application/octet-stream'), params: {} }
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */

exports.normalizeTypes = function(types) {
  return types.map(exports.normalizeType);
};


/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function acceptParams (str) {
  var length = str.length;
  var colonIndex = str.indexOf(';');
  var index = colonIndex === -1 ? length : colonIndex;
  var ret = { value: str.slice(0, index).trim(), quality: 1, params: {} };

  while (index < length) {
    var splitIndex = str.indexOf('=', index);
    if (splitIndex === -1) break;

    var colonIndex = str.indexOf(';', index);
    var endIndex = colonIndex === -1 ? length : colonIndex;

    if (splitIndex > endIndex) {
      index = str.lastIndexOf(';', splitIndex - 1) + 1;
      continue;
    }

    var key = str.slice(index, splitIndex).trim();
    var value = str.slice(splitIndex + 1, endIndex).trim();

    if (key === 'q') {
      ret.quality = parseFloat(value);
    } else {
      ret.params[key] = value;
    }

    index = endIndex + 1;
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
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
    case 'weak':
      fn = exports.wetag;
      break;
    case false:
      break;
    case 'strong':
      fn = exports.etag;
      break;
    case 'weak-cors':
      fn = exports.wetagCors;
      break;
    case 'strong-cors':
      fn = exports.etagCors;
      break;
    default:
      throw new TypeError('unknown value for etag function: ' + val);
  }

  return fn;
}

/**
 * Compile "query parser" value to function.
 *
 * @param  {String|Function} val
 * @param  {Object} [qsOptions] - Options for qs parser
 * @return {Function}
 * @api private
 */

exports.compileQueryParser = function compileQueryParser(val, qsOptions) {
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
    case 'simple':
      fn = querystring.parse;
      break;
    case false:
      break;
    case 'extended':
      fn = createExtendedQueryParser(qsOptions);
      break;
    default:
      throw new TypeError('unknown value for query parser function: ' + val);
  }

  return fn;
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
 * @param {boolean} options.weak - Generate weak ETags
 * @param {string[]} options.includeHeaders - Response headers to include in hash
 * @return {function}
 * @private
 */

function createETagGenerator (options) {
  var weak = options.weak;
  var includeHeaders = options.includeHeaders || [];

  return function generateETag (body, encoding, headers) {
    var buf = !Buffer.isBuffer(body)
      ? Buffer.from(body, encoding)
      : body;

    // If no headers to include, use body-only hashing (backward compatible)
    if (includeHeaders.length === 0 || !headers) {
      return etag(buf, { weak: weak });
    }

    // Combine body with specified headers
    var headerParts = includeHeaders
      .map(function(name) {
        var value = headers[name.toLowerCase()];
        return value ? String(value) : '';
      })
      .filter(Boolean);

    if (headerParts.length === 0) {
      // No headers present, fall back to body-only
      return etag(buf, { weak: weak });
    }

    // Create combined buffer: body + header values
    var headerBuf = Buffer.from(headerParts.join('|'), 'utf8');
    var combined = Buffer.concat([buf, Buffer.from('|'), headerBuf]);

    return etag(combined, { weak: weak });
  };
}

/**
 * Create an extended query string parser with qs.
 *
 * @param {Object} [options] - Options for qs.parse
 * @return {Function}
 * @private
 */

function createExtendedQueryParser(options) {
  var qsOptions = Object.assign({
    allowPrototypes: true,  // Backward compatibility (consider changing to false in v6)
    parameterLimit: 1000,   // Explicit default
    arrayLimit: 20,         // qs default
    depth: 5                // qs default
  }, options || {});

  return function parseExtendedQueryString(str) {
    return qs.parse(str, qsOptions);
  };
}
