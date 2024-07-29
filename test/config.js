'use strict'

var assert = require('assert');
var express = require('..');

describe('config', function () {
  describe('.set()', function () {
    it('should set a value', function () {
      var app = express();
      app.settings.set('foo', 'bar');
      assert.equal(app.settings.get('foo'), 'bar');
    })

    it('should set prototype values', function () {
      var app = express()
      app.settings.set('hasOwnProperty', 42)
      assert.strictEqual(app.settings.get('hasOwnProperty'), 42)
    })

    it('should return the app', function () {
      var app = express();
      assert.equal(app.settings.set('foo', 'bar'), app);
    })

    it('should return the app when undefined', function () {
      var app = express();
      assert.equal(app.settings.set('foo', undefined), app);
    })

    it('should return set value', function () {
      var app = express()
      app.settings.set('foo', 'bar')
      assert.strictEqual(app.settings.set('foo'), 'bar')
    })

    it('should return undefined for prototype values', function () {
      var app = express()
      assert.strictEqual(app.settings.set('hasOwnProperty'), undefined)
    })

    describe('"etag"', function(){
      it('should throw on bad value', function(){
        var app = express();
        assert.throws(app.settings.set.bind(app, 'etag', 42), /unknown value/);
      })

      it('should set "etag fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('etag', fn)
        assert.equal(app.settings.get('etag fn'), fn)
      })
    })

    describe('"trust proxy"', function(){
      it('should set "trust proxy fn"', function(){
        var app = express()
        var fn = function(){}
        app.settings.set('trust proxy', fn)
        assert.equal(app.settings.get('trust proxy fn'), fn)
      })
    })
  })

  describe('.get()', function(){
    it('should return undefined when unset', function(){
      var app = express();
      assert.strictEqual(app.settings.get('foo'), undefined);
    })

    it('should return undefined for prototype values', function () {
      var app = express()
      assert.strictEqual(app.settings.get('hasOwnProperty'), undefined)
    })

    it('should otherwise return the value', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.equal(app.settings.get('foo'), 'bar');
    })

    describe('when mounted', function(){
      it('should default to the parent app', function(){
        var app = express();
        var blog = express();

        app.set('title', 'Express');
        app.use(blog);
        assert.equal(blog.settings.get('title'), 'Express');
      })

      it('should given precedence to the child', function(){
        var app = express();
        var blog = express();

        app.use(blog);
        app.set('title', 'Express');
        blog.set('title', 'Some Blog');

        assert.equal(blog.settings.get('title'), 'Some Blog');
      })

      it('should inherit "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn() { return false }

        app.set('trust proxy', fn);
        assert.equal(app.settings.get('trust proxy'), fn);
        assert.equal(app.settings.get('trust proxy fn'), fn);

        app.use(blog);

        assert.equal(blog.settings.get('trust proxy'), fn);
        assert.equal(blog.settings.get('trust proxy fn'), fn);
      })

      it('should prefer child "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn1() { return false }
        function fn2() { return true }

        app.set('trust proxy', fn1);
        assert.equal(app.settings.get('trust proxy'), fn1);
        assert.equal(app.settings.get('trust proxy fn'), fn1);

        blog.set('trust proxy', fn2);
        assert.equal(blog.settings.get('trust proxy'), fn2);
        assert.equal(blog.settings.get('trust proxy fn'), fn2);

        app.use(blog);

        assert.equal(app.settings.get('trust proxy'), fn1);
        assert.equal(app.settings.get('trust proxy fn'), fn1);
        assert.equal(blog.settings.get('trust proxy'), fn2);
        assert.equal(blog.settings.get('trust proxy fn'), fn2);
      })
    })
  })

  describe('.enable()', function(){
    it('should set the value to true', function(){
      var app = express();
      assert.equal(app.settings.enable('tobi'), app);
      assert.strictEqual(app.settings.get('tobi'), true);
    })

    it('should set prototype values', function () {
      var app = express()
      app.enable('hasOwnProperty')
      assert.strictEqual(app.settings.get('hasOwnProperty'), true)
    })
  })

  describe('.disable()', function(){
    it('should set the value to false', function(){
      var app = express();
      assert.equal(app.settings.disable('tobi'), app);
      assert.strictEqual(app.settings.get('tobi'), false);
    })

    it('should set prototype values', function () {
      var app = express()
      app.settings.disable('hasOwnProperty')
      assert.strictEqual(app.settings.get('hasOwnProperty'), false)
    })
  })

  describe('.enabled()', function(){
    it('should default to false', function(){
      var app = express();
      assert.strictEqual(app.settings.enabled('foo'), false);
    })

    it('should return true when set', function(){
      var app = express();
      app.settings.set('foo', 'bar');
      assert.strictEqual(app.settings.enabled('foo'), true);
    })

    it('should default to false for prototype values', function () {
      var app = express()
      assert.strictEqual(app.settings.enabled('hasOwnProperty'), false)
    })
  })

  describe('.disabled()', function(){
    it('should default to true', function(){
      var app = express();
      assert.strictEqual(app.settings.disabled('foo'), true);
    })

    it('should return false when set', function(){
      var app = express();
      app.settings.set('foo', 'bar');
      assert.strictEqual(app.settings.disabled('foo'), false);
    })

    it('should default to true for prototype values', function () {
      var app = express()
      assert.strictEqual(app.settings.disabled('hasOwnProperty'), true)
    })
  })
})
