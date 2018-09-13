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
var decorator = require('./requestDecorator');
var http = require('http');

/**
 * Request prototype.
 * @public
 */

var req = decorator(Object.create(http.IncomingMessage.prototype));
/**
 * Module exports.
 * @public
 */

module.exports = req;
