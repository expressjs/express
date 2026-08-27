'use strict'

var express = require('../');
var request = require('supertest');
var assert = require('node:assert');

describe('HEAD', function(){
  it('should default to GET', function(done){
    var app = express();

    app.get('/tobi', function(req, res){
      // send() detects HEAD
      res.send('tobi');
    });

    request(app)
    .head('/tobi')
    .expect(200, done);
  })

  it('should output the same headers as GET requests', function(done){
    var app = express();

    app.get('/tobi', function(req, res){
      // send() detects HEAD
      res.send('tobi');
    });

    request(app)
    .head('/tobi')
    .expect(200, function(err, res){
      if (err) return done(err);
      var headers = res.headers;
      request(app)
      .get('/tobi')
      .expect(200, function(err, res){
        if (err) return done(err);
        delete headers.date;
        delete res.headers.date;
        assert.deepEqual(res.headers, headers);
        done();
      });
    });
  })
})

describe('app.head()', function(){
  it('should override', function(done){
    var app = express()

    app.head('/tobi', function(req, res){
      res.header('x-method', 'head')
      res.end()
    });

    app.get('/tobi', function(req, res){
      res.header('x-method', 'get')
      res.send('tobi');
    });

    request(app)
      .head('/tobi')
      .expect('x-method', 'head')
      .expect(200, done)
  })

  it('should emit a warning when HEAD is declared after GET on the same path', function (done) {
    var app = express()
    var warnings = []

    function onWarning(warning) {
      warnings.push(warning)
    }

    process.on('warning', onWarning)

    app.get('/tobi', function (req, res) {
      res.send('tobi')
    })

    app.head('/tobi', function (req, res) {
      res.end()
    })

    process.nextTick(function () {
      process.removeListener('warning', onWarning)
      assert.strictEqual(warnings.length, 1)
      assert.strictEqual(warnings[0].name, 'ExpressWarning')
      assert.ok(warnings[0].message.includes('HEAD route for "/tobi" declared after GET route will be shadowed'))
      done()
    })
  })

  it('should not emit a warning when HEAD is declared before GET on the same path', function (done) {
    var app = express()
    var warnings = []

    function onWarning(warning) {
      warnings.push(warning)
    }

    process.on('warning', onWarning)

    app.head('/tobi', function (req, res) {
      res.end()
    })

    app.get('/tobi', function (req, res) {
      res.send('tobi')
    })

    process.nextTick(function () {
      process.removeListener('warning', onWarning)
      assert.strictEqual(warnings.length, 0)
      done()
    })
  })

  it('should not emit a warning when HEAD and GET are declared on different paths', function (done) {
    var app = express()
    var warnings = []

    function onWarning(warning) {
      warnings.push(warning)
    }

    process.on('warning', onWarning)

    app.get('/foo', function (req, res) {
      res.send('foo')
    })

    app.head('/bar', function (req, res) {
      res.end()
    })

    process.nextTick(function () {
      process.removeListener('warning', onWarning)
      assert.strictEqual(warnings.length, 0)
      done()
    })
  })
})
