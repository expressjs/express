
var express = require('../')
  , Router = express.Router
  , methods = require('methods')
  , assert = require('assert');

describe('Router', function(){
  it('should return a function with router methods', function() {
    var router = Router();
    assert(typeof router == 'function');

    var router = new Router();
    assert(typeof router == 'function');

    assert(typeof router.get == 'function');
    assert(typeof router.handle == 'function');
    assert(typeof router.use == 'function');
  });

  it('should support .use of other routers', function(done){
    var router = new Router();
    var another = new Router();

    another.get('/bar', function(req, res){
      res.end();
    });
    router.use('/foo', another);

    router.handle({ url: '/foo/bar', method: 'GET' }, { end: done });
  });

  it('should support dynamic routes', function(done){
    var router = new Router();
    var another = new Router();

    another.get('/:bar', function(req, res){
      req.params.foo.should.equal('test');
      req.params.bar.should.equal('route');
      res.end();
    });
    router.use('/:foo', another);

    router.handle({ url: '/test/route', method: 'GET' }, { end: done });
  });

  describe('.handle', function(){
    it('should dispatch', function(done){
      var router = new Router();

      router.route('/foo').get(function(req, res){
        res.send('foo');
      });

      var res = {
        send: function(val) {
          val.should.equal('foo');
          done();
        }
      }
      router.handle({ url: '/foo', method: 'GET' }, res);
    })
  })

  describe('.multiple callbacks', function(){
    it('should throw if a callback is null', function(){
      assert.throws(function () {
        var router = new Router();
        router.route('/foo').all(null);
      })
    })

    it('should throw if a callback is undefined', function(){
      assert.throws(function () {
        var router = new Router();
        router.route('/foo').all(undefined);
      })
    })

    it('should throw if a callback is not a function', function(){
      assert.throws(function () {
        var router = new Router();
        router.route('/foo').all('not a function');
      })
    })

    it('should not throw if all callbacks are functions', function(){
      var router = new Router();
      router.route('/foo').all(function(){}).all(function(){});
    })
  })

  describe('error', function(){
    it('should skip non error middleware', function(done){
      var router = new Router();

      router.get('/foo', function(req, res, next){
        next(new Error('foo'));
      });

      router.get('/bar', function(req, res, next){
        next(new Error('bar'));
      });

      router.use(function(req, res, next){
        assert(false);
      });

      router.use(function(err, req, res, next){
        assert.equal(err.message, 'foo');
        done();
      });

      router.handle({ url: '/foo', method: 'GET' }, {}, done);
    });
  })

  describe('.all', function() {
    it('should support using .all to capture all http verbs', function(done){
      var router = new Router();

      var count = 0;
      router.all('/foo', function(){ count++; });

      var url = '/foo?bar=baz';

      methods.forEach(function testMethod(method) {
        router.handle({ url: url, method: method }, {}, function() {});
      });

      assert.equal(count, methods.length);
      done();
    })
  })

  describe('.param', function() {
    it('should call param function when routing VERBS', function(done) {
      var router = new Router();

      router.param('id', function(req, res, next, id) {
        assert.equal(id, '123');
        next();
      });

      router.get('/foo/:id/bar', function(req, res, next) {
        assert.equal(req.params.id, '123');
        next();
      });

      router.handle({ url: '/foo/123/bar', method: 'get' }, {}, done);
    });

    it('should call param function when routing middleware', function(done) {
      var router = new Router();

      router.param('id', function(req, res, next, id) {
        assert.equal(id, '123');
        next();
      });

      router.use('/foo/:id/bar', function(req, res, next) {
        assert.equal(req.params.id, '123');
        assert.equal(req.url, '/baz');
        next();
      });

      router.handle({ url: '/foo/123/bar/baz', method: 'get' }, {}, done);
    });
  });
})
