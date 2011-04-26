
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
 * Expose `HTTPSServer`.
 */

exports = module.exports = HTTPSServer;

/**
 * Server proto.
 */

var app = HTTPSServer.prototype;

/**
 * Initialize a new `HTTPSServer` with the 
 * given `options`, and optional `middleware`.
 *
 * @param {Object} options
 * @param {Array} middleware
 * @api public
 */

function HTTPSServer(options, middleware){
  connect.HTTPSServer.call(this, options, []);
  this.init(middleware);
};

/**
 * Inherit from `connect.HTTPSServer`.
 */

app.__proto__ = connect.HTTPSServer.prototype;

// mixin HTTPServer methods

Object.keys(HTTPServer.prototype).forEach(function(method){
  app[method] = HTTPServer.prototype[method];
});
