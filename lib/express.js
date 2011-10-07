
/*!
 * Express
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect')
  , proto = require('./application')
  , Route = require('./router/route')
  , utils = connect.utils;

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Framework version.
 */

exports.version = '3.0.0alpha1';

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = connect();
  utils.merge(app, proto);
  app.init();
  return app;
}

/**
 * Expose connect.middleware as express.*
 * for example `express.logger` etc. 
 */

for (var key in connect.middleware) {
  var desc = Object.getOwnPropertyDescriptor(connect.middleware, key);
  Object.defineProperty(exports, key, desc);
}

/**
 * Expose constructors.
 */

exports.Route = Route;

/**
 * Expose HTTP methods.
 */

exports.methods = require('./router/methods');

/**
 * Response extensions.
 */

require('./response');

/**
 * Request extensions.
 */

require('./request');

// Error handler title

exports.errorHandler.title = 'Express';

