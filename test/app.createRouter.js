var express = require('../')
var assert = require('assert')

describe('app.createRouter()', function () {

  it('should create a router that inherits settings from app.settings', function () {
    var app = express()
    app.set('strict', true)
    app.set('caseSensitive', true)

    var router = app.createRouter()

    assert(router.strict, 'Router did not inherit options from app.settings')
    assert(router.caseSensitive, 'Router did not merge options with app.settings')
  })

  it('should allow options param to override app.settings when creating router', function () {
    var app = express()
    app.set('strict', true)

    var router = app.createRouter({
      strict: false
    })

    assert.equal(router.strict, false, 'options param did not override app.settings')
  })
})
