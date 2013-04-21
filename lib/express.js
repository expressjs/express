/**
 * Module dependencies.
 */

var connect = require('connect')
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

exports.version = '3.2.0';

/**
 * Expose mime.
 */

exports.mime = connect.mime;

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
 * Error on createServer().
 */

exports.createServer = function(){
  console.warn('Warning: express.createServer() is deprecated, express');
  console.warn('applications no longer inherit from http.Server,');
  console.warn('please use:');
  console.warn('');
  console.warn('  var express = require("express");');
  console.warn('  var app = express();');
  console.warn('');
  return createApplication();
};

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

// Error handler title

exports.errorHandler.title = 'Express';

