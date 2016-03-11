
var express = require('..');
var request = require('supertest');

describe('res', function() {
  describe('.scope(name)', function() {
    it('should create and retrieve scope objects', function(done) {
      var app = express();

      app.use(function(req, res, next) {
        res.scope('aux').foo = 'foo';
        res.send(res.scope('aux').foo);
      });

      request(app)
        .get('/')
        .expect('foo', done);
    })

    it('should keep scope objects distinct', function(done) {
      var app = express();

      app.use(function(req, res, next) {
        res.scope('aux1').foo = 'foo';
        next();
      });

      app.use(function(req, res, next) {
        res.scope('aux2').bar = 'bar';
        next();
      });

      app.use(function(req, res, next) {
        var bits = [
          res.scope('aux1').foo,
          res.scope('aux1').bar,
          res.scope('aux2').foo,
          res.scope('aux2').bar
        ];
        res.send(bits.join(','));
      });

      request(app)
        .get('/')
        .expect('foo,,,bar', done);
    })

    it('should place scopes created later at the end of the stack', function(done) {
      var app = express();

      app.use(function(req, res, next) {
        res.scope('aux1').foo = 'foo';
        res.scope('aux2').bar = 'bar';

        var bits = [
          res.scopeStack[0].foo,
          res.scopeStack[1].bar
        ];
        res.send(bits.join(','));
      });

      request(app)
        .get('/')
        .expect('foo,bar', done);
    })
  })

  describe('.scope(name, scope, replace)', function() {
    it('should store and retrieve scope objects', function(done) {
      var app = express();

      var scope = {};

      app.use(function(req, res, next) {
        res.scope('aux', scope);
        scope.foo = 'foo';
        res.send(res.scope('aux').foo);
      });

      request(app)
        .get('/')
        .expect('foo', done);
    })

    it('should reorder when overwriting scopes', function(done) {
      var app = express();

      app.use(function(req, res, next) {
        res.scope('aux1', { foo: 'foo' });
        res.scope('aux2', { bar: 'bar' });
        res.scope('aux1', { foo: 'goo' });

        var bits = [
          res.scopeStack[0].bar,
          res.scopeStack[1].foo,
          res.scopeStack.length
        ];
        res.send(bits.join(','));
      });

      request(app)
        .get('/')
        .expect('bar,goo,2', done);
    })

    it('should keep same ordering when replacing scopes', function(done) {
      var app = express();

      app.use(function(req, res, next) {
        res.scope('aux1', { foo: 'foo' });
        res.scope('aux2', { bar: 'bar' });
        res.scope('aux1', { foo: 'goo' }, true);

        var bits = [
          res.scopeStack[0].foo,
          res.scopeStack[1].bar,
          res.scopeStack.length
        ];
        res.send(bits.join(','));
      });

      request(app)
        .get('/')
        .expect('goo,bar,2', done);
    })
  })
})
