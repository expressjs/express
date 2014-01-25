/**
 * Module dependencies.
 */

var connect = require('connect')
  , merge = require('merge-descriptors')
  , mixin = require('utils-merge')

var proto = require('./application')
  , Route = require('./router/route')
  , Router = require('./router')
  , req = require('./request')
  , res = require('./response')

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
  mixin(app, proto);
  app.request = { __proto__: req, app: app };
  app.response = { __proto__: res, app: app };
  app.init();
  return app;
}

/**
 * Expose connect.middleware as express.*
 * for example `express.logger` etc.
 */

merge(exports, connect.middleware);

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

