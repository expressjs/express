'use strict'

var assert = require('assert')
var express = require('../')

describe('app', function(){
  describe('.locals', function () {
    it('should default object', function () {
      var app = express()
      assert.ok(app.locals)
      assert.strictEqual(typeof app.locals, 'object')
    })
  })

  describe('.locals.settings', function(){
    it('should expose app settings', function(){
      var app = express();
      app.set('title', 'House of Manny');
      var obj = app.locals.settings;
      assert.equal(obj.title, 'House of Manny');
    })
  })
})
