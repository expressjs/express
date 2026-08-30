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
 */

var bodyParser = require('body-parser')
var EventEmitter = require('node:events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Router = require('router');
var req = require('./request');
var res = require('./response');

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Wrap Router.prototype.head to warn if declared after a GET route on the same path.
 */

if (Router.prototype && typeof Router.prototype.head === 'function') {
  var origRouterHead = Router.prototype.head;
  Router.prototype.head = function head(path) {
    if (Array.isArray(this.stack)) {
      var hasPrecedingGet = this.stack.some(function (layer) {
        return layer.route && layer.route.path === path && layer.route.methods && layer.route.methods.get;
      });
      if (hasPrecedingGet) {
        process.emitWarning(
          'HEAD route for "' + path + '" declared after GET route will be shadowed. Declare HEAD routes before GET routes to ensure they execute.',
          'ExpressWarning'
        );
      }
    }
    return origRouterHead.apply(this, arguments);
  };
}

/**
 * Expose constructors.
 */

exports.Route = Router.Route;
exports.Router = Router;

/**
 * Expose middleware
 */

exports.json = bodyParser.json
exports.raw = bodyParser.raw
exports.static = require('serve-static');
exports.text = bodyParser.text
exports.urlencoded = bodyParser.urlencoded
