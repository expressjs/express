
/*!
 * Express
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect')
  , HTTPSServer = require('./https')
  , HTTPServer = require('./http');

/**
 * Re-export connect auto-loaders.
 * 
 * This prevents the need to `require('connect')` in order
 * to access core middleware, so for example `express.logger()` instead
 * of `require('connect').logger()`.
 */

var exports = module.exports = connect.middleware;

/**
 * Framework version.
 */

exports.version = '2.0.0beta';

/**
 * Shortcut for `new Server(...)`.
 *
 * @param {Function} ...
 * @return {Server}
 * @api public
 */

exports.createServer = function(options){
  if ('object' == typeof options) {
    return new HTTPSServer(options, Array.prototype.slice.call(arguments, 1));
  } else {
    return new HTTPServer(Array.prototype.slice.call(arguments));
  }
};

/**
 * Expose `HTTPServer`.
 */

exports.HTTPServer = HTTPServer;

/**
 * View extensions.
 */

require('./view');

/**
 * Response extensions.
 */

require('./response');

/**
 * Request extensions.
 */

require('./request');
