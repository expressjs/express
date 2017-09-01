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
var http2 = require('http2');
var http2Constants = http2.constants;
var decorator = require('./requestDecorator');
var defineGetter = require('./utils').defineGetter;
var http2Req = decorator(Object.create(http2.Http2ServerRequest.prototype));

/**
 * Override default http2 path to return only pathname 
 * as it returns full url
 * Gets the full URL from the headers
 * Creates a mock object for parse to cache on and read from
 * as url in http2 refers to this.path which will results in an error
 */
defineGetter(http2Req, 'path', function path() {
  var path;
  var headers = this.headers;
  if (headers === undefined) {
    return '';
  }
  path = headers[http2Constants.HTTP2_HEADER_PATH];
  this.parsedObject = this.parsedObject || {url: path};
  this.parsedObject.url = path;
  return parse(this.parsedObject).pathname;
});

/**
 * Module exports.
 * @public
 */

module.exports = http2Req;
