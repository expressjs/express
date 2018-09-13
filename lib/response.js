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
var http = require('http');
var decorator = require('./responseDecorator');
/**
 * Response prototype.
 * @public
 */

var res = decorator(Object.create(http.ServerResponse.prototype));
/**
 * Module exports.
 * @public
 */

module.exports = res;
