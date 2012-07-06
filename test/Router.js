
var express = require('../')
  , Router = express.Router
  , request = require('./support/http')
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
})