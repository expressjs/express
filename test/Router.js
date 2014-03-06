
var express = require('../')
  , Router = express.Router
  , request = require('supertest')
  , methods = require('methods')
  , assert = require('assert');

describe('Router', function(){
  var router, app;

  beforeEach(function(){
    router = new Router;
    app = express();
  })

  describe('.match(method, url, i)', function(){
    it('should match based on index', function(){
      router.route('get', '/foo', function(){});
      router.route('get', '/foob?', function(){});
      router.route('get', '/bar', function(){});

      var method = 'GET';
      var url = '/foo?bar=baz';

      var route = router.match(method, url, 0);
      route.constructor.name.should.equal('Route');
      route.method.should.equal('get');
      route.path.should.equal('/foo');

      var route = router.match(method, url, 1);
      route.path.should.equal('/foob?');

      var route = router.match(method, url, 2);
      assert(!route);

      url = '/bar';
      var route = router.match(method, url);
      route.path.should.equal('/bar');
    })
  })
  
  describe('.matchRequest(req, i)', function(){
    it('should match based on index', function(){
      router.route('get', '/foo', function(){});
      router.route('get', '/foob?', function(){});
      router.route('get', '/bar', function(){});
      var req = { method: 'GET', url: '/foo?bar=baz' };

      var route = router.matchRequest(req, 0);
      route.constructor.name.should.equal('Route');
      route.method.should.equal('get');
      route.path.should.equal('/foo');

      var route = router.matchRequest(req, 1);
      req._route_index.should.equal(1);
      route.path.should.equal('/foob?');

      var route = router.matchRequest(req, 2);
      assert(!route);

      req.url = '/bar';
      var route = router.matchRequest(req);
      route.path.should.equal('/bar');
    })
  })

  describe('.middleware', function(){
    it('should dispatch', function(done){
      router.route('get', '/foo', function(req, res){
        res.send('foo');
      });

      app.use(router.middleware);

      request(app)
      .get('/foo')
      .expect('foo', done);
    })
  })

  describe('.multiple callbacks', function(){
    it('should throw if a callback is null', function(){
      assert.throws(function () {
        router.route('get', '/foo', null, function(){});
      })
    })

    it('should throw if a callback is undefined', function(){
      assert.throws(function () {
        router.route('get', '/foo', undefined, function(){});
      })
    })

    it('should throw if a callback is not a function', function(){
      assert.throws(function () {
        router.route('get', '/foo', 'not a function', function(){});
      })
    })

    it('should not throw if all callbacks are functions', function(){
      router.route('get', '/foo', function(){}, function(){});
    })
  })

  describe('.all', function() {
    it('should support using .all to capture all http verbs', function() {
      var router = new Router();

      router.all('/foo', function(){});

      var url = '/foo?bar=baz';

      methods.forEach(function testMethod(method) {
        var route = router.match(method, url);
        route.constructor.name.should.equal('Route');
        route.method.should.equal(method);
        route.path.should.equal('/foo');
      });
    })
  })
})
