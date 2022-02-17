'use strict'

var assert = require('assert')
var express = require('../')
var should = require('should')

describe('app', function(){
  describe('.locals(obj)', function(){
    it('should merge locals', function(){
      var app = express();
      should(Object.keys(app.locals)).eql(['settings'])
      app.locals.user = 'tobi';
      app.locals.age = 2;
      should(Object.keys(app.locals)).eql(['settings', 'user', 'age'])
      assert.strictEqual(app.locals.user, 'tobi')
      assert.strictEqual(app.locals.age, 2)
    })
  })

  describe('.locals.settings', function(){
    it('should expose app settings', function(){
      var app = express();
      app.set('title', 'House of Manny');
      var obj = app.locals.settings;
      should(obj).have.property('env', 'test')
      should(obj).have.property('title', 'House of Manny')
    })
  })
})
