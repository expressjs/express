/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */
var Http2ServerResponse = require('http2').Http2ServerResponse;
var decorator = require('./responseDecorator');
/**
 * Response prototype.
 * @public
 */

var res = decorator(Object.create(Http2ServerResponse.prototype));

/**
 * Module exports.
 * @public
 */

module.exports = res;

