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

const { json, raw, text, urlencoded } = require('body-parser');
var EventEmitter = require('node:events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Router = require('router');
const Route = Router.Route;
var req = require('./request');
var res = require('./response');

/**
 * Expose `createApplication()`.
 */

module.exports = createApplication;

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

module.exports.application = proto;
module.exports.request = req;
module.exports.response = res;

/**
 * Expose constructors.
 */

module.exports.Route = Route;
module.exports.Router = Router;

/**
 * Expose middleware
 */

module.exports.json = json;
module.exports.raw = raw;
module.exports.static = require('serve-static');
module.exports.text = text;
module.exports.urlencoded = urlencoded;
