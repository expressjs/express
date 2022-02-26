
var assert = require('assert');
var express = require('../')

describe('app', function(){
  describe('.locals(obj)', function(){
    it('should merge locals', function(){
      var app = express();
      assert.deepStrictEqual(Object.keys(app.locals), ['settings']);
      app.locals.user = 'tobi';
      app.locals.age = 2;
      assert.deepStrictEqual(Object.keys(app.locals), ['settings', 'user', 'age']);
      assert.strictEqual(app.locals.user, 'tobi');
      assert.strictEqual(app.locals.age, 2);
    })
  })

  describe('.locals.settings', function(){
    it('should expose app settings', function(){
      var app = express();
      app.set('title', 'House of Manny');
      var obj = app.locals.settings;
      assert.strictEqual(obj.env, 'test');
      assert.strictEqual(obj.title, 'House of Manny');
    })
  })
})
