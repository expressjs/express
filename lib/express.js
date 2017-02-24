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

  app.createServer = opts.createServer
  app.request = Object.create(req(opts.reqProto), {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })
  app.response = Object.create(res(opts.resProto), {
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

exports.static = require('serve-static');

/**
 * Replace removed middleware with an appropriate error message.
 */

[
  'json',
  'urlencoded',
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache',
  'query',
].forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
    },
    configurable: true
  });
});
