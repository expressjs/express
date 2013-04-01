
var express = require('../')
  , Router = express.Router
  , request = require('./support/http')
  , assert = require('assert')
  , should = require('should');

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

  describe('.arrays of paths', function(){
    it('should match all paths', function(){
      var route;

      router.route('get', ['/:id/explain/:section', '/:id', '/:id/edit/:section'], function(){});

      route = router.match('get', '/id_val');
      route.params.id.should.equal('id_val');

      route = router.match('get', '/id_val/edit/section_val');
      route.params.id.should.equal('id_val');
      route.params.section.should.equal('section_val');

      route = router.match('get', '/id_val/explain/section_val');
      route.params.id.should.equal('id_val');
      route.params.section.should.equal('section_val');
    })
    it('should not match other paths', function(){
      router.route('get', ['/:id/explain/:section', '/:id', '/:id/edit/:section'], function(){});
      should.not.exist(router.match('get', '/id_val/strange_action/section_val'));
    })
  })
})
