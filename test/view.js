'use strict'

var assert = require('node:assert')
var View = require('../lib/view')

describe('View', function () {
  it('should handle missing options object', function () {
    assert.throws(function () {
      new View('name')
    }, /No default engine was specified and no extension was provided\./)
  })
})
