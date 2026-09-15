'use strict'

var assert = require('node:assert')
var express = require('../')

describe('app.createRouter()', function () {
  it('should inherit routing settings from the app', function () {
    var app = express()

    app.enable('case sensitive routing')
    app.enable('strict routing')

    var router = app.createRouter()

    assert.strictEqual(router.caseSensitive, true)
    assert.strictEqual(router.strict, true)
  })

  it('should allow options to override inherited settings', function () {
    var app = express()

    app.enable('case sensitive routing')
    app.enable('strict routing')

    var router = app.createRouter({
      caseSensitive: false,
      strict: false
    })

    assert.strictEqual(router.caseSensitive, false)
    assert.strictEqual(router.strict, false)
  })

  it('should pass other options to the router', function () {
    var app = express()
    var router = app.createRouter({ mergeParams: true })

    assert.strictEqual(router.mergeParams, true)
  })
})
