/**
 * Module dependencies.
 */

var deprecate = require('depd')('express');
var mixin = require('merge-descriptors');
var merge = require('utils-merge');
var connect = require('connect')
  , proto = require('./application')
  , Route = require('./router/route')
  , Router = require('./router')
  , req = require('./request')
  , res = require('./response');

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

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
  merge(app, proto);
  app.request = { __proto__: req, app: app };
  app.response = { __proto__: res, app: app };
  app.init();
  return app;
}

/**
 * Expose connect.middleware as express.*
 * for example `express.logger` etc.
 */

mixin(exports, connect.middleware);

/**
 * Deprecated createServer().
 */

exports.createServer = deprecate.function(createApplication,
  'createServer() is deprecated\n' +
  'express applications no longer inherit from http.Server\n' +
  'please use:\n' +
  '\n' +
  '  var express = require("express");\n' +
  '  var app = express();\n' +
  '\n'
);

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

