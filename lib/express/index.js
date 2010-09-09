
/*!
 * Express
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Re-export connect auto-loaders.
 * 
 * This prevents the need to `require('connect')` in order
 * to access core middleware, so for example `express.logger()` instead
 * of `require('connect').logger()`.
 */

var exports = module.exports = require('connect').middleware;

/**
 * Framework version.
 */

exports.version = '1.0.0rc2';

/**
 * Module dependencies.
 */

var Server = exports.Server = require('./server');

/**
 * Shortcut for `new Server(...)`.
 *
 * @param {Function} ...
 * @return {Server}
 * @api public
 */

exports.createServer = function(){
    return new Server(Array.prototype.slice.call(arguments));
};

/**
 * View extensions.
 */

require('./view');
require('./response');
require('./request');
