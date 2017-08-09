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
var decorator = require('./requestDecorator');
var http2Req = decorator(Object.create(http2.Http2ServerRequest.prototype));
/**
 * Module exports.
 * @public
 */

module.exports = http2Req;
