
var express = require('../')
  , Route = express.Route
  , methods = require('methods')
  , assert = require('assert');

describe('Route', function(){

  describe('.all', function(){
    it('should add handler', function(done){
      var route = new Route('/foo');

      route.all(function(req, res, next) {
        assert.equal(req.a, 1);
        assert.equal(res.b, 2);
        next();
      });

      route.dispatch({ a:1, method: 'GET' }, { b:2 }, done);
    })

    it('should handle VERBS', function(done) {
      var route = new Route('/foo');

      var count = 0;
      route.all(function(req, res, next) {
        count++;
      });

      methods.forEach(function testMethod(method) {
        route.dispatch({ method: method }, {});
      });

      assert.equal(count, methods.length);
      done();
    })

    it('should stack', function(done) {
      var route = new Route('/foo');

      var count = 0;
      route.all(function(req, res, next) {
        count++;
        next();
      });

      route.all(function(req, res, next) {
        count++;
        next();
      });

      route.dispatch({ method: 'GET' }, {}, function(err) {
        assert.ifError(err);
        count++;
      });

      assert.equal(count, 3);
      done();
    })
  })

  describe('.VERB', function(){
    it('should support .get', function(done){
      var route = new Route('');

      var count = 0;
      route.get(function(req, res, next) {
        count++;
      })

      route.dispatch({ method: 'GET' }, {});
      assert(count);
      done();
    })

    it('should limit to just .VERB', function(done){
      var route = new Route('');

      route.get(function(req, res, next) {
        assert(false);
        done();
      })

      route.post(function(req, res, next) {
        assert(true);
      })

      route.dispatch({ method: 'post' }, {});
      done();
    })

    it('should allow fallthrough', function(done){
      var route = new Route('');

      var order = '';
      route.get(function(req, res, next) {
        order += 'a';
        next();
      })

      route.all(function(req, res, next) {
        order += 'b';
        next();
      });

      route.get(function(req, res, next) {
        order += 'c';
      })

      route.dispatch({ method: 'get' }, {});
      assert.equal(order, 'abc');
      done();
    })
  })

  describe('errors', function(){
    it('should handle errors via arity 4 functions', function(done){
      var route = new Route('');

      var order = '';
      route.all(function(req, res, next){
        next(new Error('foobar'));
      });

      route.all(function(req, res, next){
        order += '0';
        next();
      });

      route.all(function(err, req, res, next){
        order += 'a';
        next(err);
      });

      route.all(function(err, req, res, next){
        assert.equal(err.message, 'foobar');
        assert.equal(order, 'a');
        done();
      });

      route.dispatch({ method: 'get' }, {});
    })
  })
})
