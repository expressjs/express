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
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Router = require('router');
var req = require('./request');
var res = require('./response');

/**
 * Only reqire http when requested
 */
var http = {}
var _http
Object.defineProperty(http, 'IncomingMessage', {
  get: function () {
    _http = _http || require('http')
    return _http.IncomingMessage
  }
})
Object.defineProperty(http, 'ServerResponse', {
  get: function () {
    _http = _http || require('http')
    return _http.ServerResponse
  }
})
Object.defineProperty(http, 'createServer', {
  get: function () {
    _http = _http || require('http')
    return _http.createServer
  }
})

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

function createApplication (opts) {
  var options = opts || {}
  options.reqProto = options.reqProto || http.IncomingMessage.prototype
  options.resProto = options.resProto || http.ServerResponse.prototype
  options.createServer = options.createServer || http.createServer

  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  app.createServer = options.createServer
  // expose the prototype that will get set on requests
  app.request = Object.create(req(options.reqProto), {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })
  // expose the prototype that will get set on responses
  app.response = Object.create(res(options.resProto), {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req.proto
exports.response = res.proto

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
