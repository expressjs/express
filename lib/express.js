/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */

const bodyParser = require('body-parser')
const { EventEmitter } = require('node:events')
const mixin = require('merge-descriptors')
const proto = require('./application')
const Router = require('router')
const req = require('./request')
const res = require('./response')

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication () {
  const app = function (req, res, next) {
    app.handle(req, res, next)
  }

  mixin(app, EventEmitter.prototype, false)
  mixin(app, proto, false)

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init()
  return app
}

/**
 * Expose the prototypes.
 */

exports.application = proto
exports.request = req
exports.response = res

/**
 * Expose constructors.
 */

exports.Route = Router.Route
exports.Router = Router

/**
 * Expose middleware
 */

exports.json = bodyParser.json
exports.raw = bodyParser.raw
exports.static = require('serve-static')
exports.text = bodyParser.text
exports.urlencoded = bodyParser.urlencoded
