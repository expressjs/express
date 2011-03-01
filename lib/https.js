
/*!
 * Express - HTTPSServer
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect')
  , HTTPServer = require('./http')
  , https = require('https');

/**
 * Initialize a new `HTTPSServer` with the 
 * given `options`, and optional `middleware`.
 *
 * @param {Object} options
 * @param {Array} middleware
 * @api public
 */

var Server = exports = module.exports = function HTTPSServer(options, middleware){
  connect.HTTPSServer.call(this, options, []);
  this.init(middleware);
};

/**
 * Inherit from `connect.HTTPSServer`.
 */

Server.prototype.__proto__ = connect.HTTPSServer.prototype;

// mixin HTTPServer methods

Object.keys(HTTPServer.prototype).forEach(function(method){
  Server.prototype[method] = HTTPServer.prototype[method];
});
