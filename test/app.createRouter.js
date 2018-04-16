var express = require('../')
var assert = require('assert')

describe('app.createRouter()', function () {

  it('should create a router that inherits settings from app.settings', function () {
    var app = express()
    app.set('strict routing', true)
    app.set('case sensitive routing', true)

    var router = app.createRouter()

    assert(router.strict, 'Router did not inherit strict option from app.settings')
    assert(router.caseSensitive, 'Router did not inherit case sensitive option from app.settings')
  })

  it('should allow options param to override app.settings when creating router', function () {
    var app = express()
    app.set('strict routing', true)
    app.set('case sensitive routing', false)

    var router = app.createRouter({
      strict: false,
      caseSensitive: true
    })

    assert.equal(router.strict, false, 'options param strict did not override app.settings')
    assert.equal(router.caseSensitive, true, 'options param caseSensitive did not override app.settings')
  })
})
