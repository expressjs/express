'use strict'

var assert = require('node:assert')
var express = require('../')
  , request = require('supertest');

describe('app.logerror', function () {
  var originalEnv;
  var logged;
  var originalConsoleError;

  before(function () {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    originalConsoleError = console.error;
    console.error = function (val) { logged = val; };
  });

  after(function () {
    process.env.NODE_ENV = originalEnv;
    console.error = originalConsoleError;
  });

  beforeEach(function () {
    logged = undefined;
  });

  it('should log the Error object, not just the stack string', function (done) {
    var cause = new Error('database connection refused');
    var err = new Error('request failed', { cause: cause });

    var app = express();
    app.get('/', function (req, res, next) { next(err); });

    request(app)
      .get('/')
      .expect(500, function () {
        // finalhandler schedules onerror via setImmediate; wait one tick
        setImmediate(function () {
          assert.strictEqual(logged, err, 'logerror should pass the Error object to console.error');
          assert.strictEqual(logged.cause, cause, 'Error.cause should be preserved on the logged object');
          done();
        });
      });
  });
});

describe('app', function(){
  describe('.VERB()', function(){
    it('should not get invoked without error handler on error', function(done) {
      var app = express();

      app.use(function(req, res, next){
        next(new Error('boom!'))
      });

      app.get('/bar', function(req, res){
        res.send('hello, world!');
      });

      request(app)
      .post('/bar')
      .expect(500, /Error: boom!/, done);
    });

    it('should only call an error handling routing callback when an error is propagated', function(done){
      var app = express();

      var a = false;
      var b = false;
      var c = false;
      var d = false;

      app.get('/', function(req, res, next){
        next(new Error('fabricated error'));
      }, function(req, res, next) {
        a = true;
        next();
      }, function(err, req, res, next){
        b = true;
        assert.strictEqual(err.message, 'fabricated error')
        next(err);
      }, function(err, req, res, next){
        c = true;
        assert.strictEqual(err.message, 'fabricated error')
        next();
      }, function(err, req, res, next){
        d = true;
        next();
      }, function(req, res){
        assert.ok(!a)
        assert.ok(b)
        assert.ok(c)
        assert.ok(!d)
        res.sendStatus(204);
      });

      request(app)
      .get('/')
      .expect(204, done);
    })
  })
})
