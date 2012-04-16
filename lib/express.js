
/*!
 * Express
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http')
  , connect = require('connect')
  , proto = require('./application')
  , Route = require('./router/route')
  , Router = require('./router')
  , req = require('./request')
  , res = require('./response')
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
  app.request = { __proto__: req };
  app.response = { __proto__: res };
  app.init();
  return app;
}

/**
 * Expose connect.middleware as express.*
 * for example `express.logger` etc. 
 */

for (var key in connect.middleware) {
  Object.defineProperty(
      exports
    , key
    , Object.getOwnPropertyDescriptor(connect.middleware, key));
}

/**
 * Backwards compat.
 */

exports.createServer = createApplication;

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose HTTP methods.
 */

exports.methods = require('./router/methods');

// Error handler title

exports.errorHandler.title = 'Express';

