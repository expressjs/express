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
const { EventEmitter } = require('node:events');
var mixin = require('merge-descriptors');
const application = require('./application');
var Router = require('router');
const { Route } = Router;
const request = require('./request');
const response = require('./response');

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
  mixin(app, application, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(request, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(response, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

module.exports.application = application;
module.exports.request = request;
module.exports.response = response;

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
