
var assert = require('assert');
var express = require('..');

describe('config', function () {
  describe('.set()', function () {
    it('should set a value', function () {
      var app = express();
      app.set('foo', 'bar');
      assert.equal(app.get('foo'), 'bar');
    })

    it('should return the app', function () {
      var app = express();
      assert.equal(app.set('foo', 'bar'), app);
    })

    it('should return the app when undefined', function () {
      var app = express();
      assert.equal(app.set('foo', undefined), app);
    })

    describe('"etag"', function(){
      it('should throw on bad value', function(){
        var app = express();
        assert.throws(app.set.bind(app, 'etag', 42), /unknown value/);
      })

      it('should set "etag fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('etag', fn)
        assert.equal(app.get('etag fn'), fn)
      })
    })

    describe('"trust proxy"', function(){
      it('should set "trust proxy fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('trust proxy', fn)
        assert.equal(app.get('trust proxy fn'), fn)
      })
    })
  })

  describe('.get()', function(){
    it('should return undefined when unset', function(){
      var app = express();
      assert.strictEqual(app.get('foo'), undefined);
    })

    it('should otherwise return the value', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.equal(app.get('foo'), 'bar');
    })

    describe('when mounted', function(){
      it('should default to the parent app', function(){
        var app = express();
        var blog = express();

        app.set('title', 'Express');
        app.use(blog);
        assert.equal(blog.get('title'), 'Express');
      })

      it('should given precedence to the child', function(){
        var app = express();
        var blog = express();

        app.use(blog);
        app.set('title', 'Express');
        blog.set('title', 'Some Blog');

        assert.equal(blog.get('title'), 'Some Blog');
      })

      it('should inherit "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn() { return false }

        app.set('trust proxy', fn);
        assert.equal(app.get('trust proxy'), fn);
        assert.equal(app.get('trust proxy fn'), fn);

        app.use(blog);

        assert.equal(blog.get('trust proxy'), fn);
        assert.equal(blog.get('trust proxy fn'), fn);
      })

      it('should prefer child "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn1() { return false }
        function fn2() { return true }

        app.set('trust proxy', fn1);
        assert.equal(app.get('trust proxy'), fn1);
        assert.equal(app.get('trust proxy fn'), fn1);

        blog.set('trust proxy', fn2);
        assert.equal(blog.get('trust proxy'), fn2);
        assert.equal(blog.get('trust proxy fn'), fn2);

        app.use(blog);

        assert.equal(app.get('trust proxy'), fn1);
        assert.equal(app.get('trust proxy fn'), fn1);
        assert.equal(blog.get('trust proxy'), fn2);
        assert.equal(blog.get('trust proxy fn'), fn2);
      })
    })
  })

  describe('.extend()', function () {
    it('should set if value is nonexistent', function () {
      var app = express();
      app.extend('foo', { 'bar' : 1 });
      assert.deepEqual(app.get('foo'), { 'bar' : 1 });
    })

    it('should extend an object', function () {
      var app = express();
      app.extend('foo', { 'bar' : 1 });
      app.extend('foo', { 'baz' : 1 });
      assert.deepEqual(app.get('foo'), { 'bar' : 1, 'baz' : 1 });
    })

    it('should not extend by reference', function () {
      var app1 = express();
      var app2 = express();

      app1.set('foo', { active: false });
      assert.equal(app1.get('foo').active, false);
      assert.equal(app2.get('foo'), undefined);

      app1.use(app2);
      assert.equal(app1.get('foo').active, false);
      assert.equal(app2.get('foo').active, false);

      app2.extend('foo', { active: true });
      assert.deepEqual(app1.get('foo'), { active: false });
      assert.deepEqual(app2.get('foo'), { active: true });
    })

    it('should return the app', function () {
      var app = express();
      assert.equal(app.extend('foo', { 'bar' : 1 }), app);
    })

    it('should return the app when undefined', function () {
      var app = express();
      assert.equal(app.extend('foo', undefined), app);
    })

    it('should throw on a bad value', function () {
      var app = express();
      (function(){
        app.extend('foo', null);
      }).should.throw('value needs to be an object');
    })
  })

  describe('.enable()', function(){
    it('should set the value to true', function(){
      var app = express();
      assert.equal(app.enable('tobi'), app);
      assert.strictEqual(app.get('tobi'), true);
    })
  })

  describe('.disable()', function(){
    it('should set the value to false', function(){
      var app = express();
      assert.equal(app.disable('tobi'), app);
      assert.strictEqual(app.get('tobi'), false);
    })
  })

  describe('.enabled()', function(){
    it('should default to false', function(){
      var app = express();
      assert.strictEqual(app.enabled('foo'), false);
    })

    it('should return true when set', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.strictEqual(app.enabled('foo'), true);
    })
  })

  describe('.disabled()', function(){
    it('should default to true', function(){
      var app = express();
      assert.strictEqual(app.disabled('foo'), true);
    })

    it('should return false when set', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.strictEqual(app.disabled('foo'), false);
    })
  })
})
