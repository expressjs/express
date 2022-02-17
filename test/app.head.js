'use strict'

var express = require('../');
var request = require('supertest');
var assert = require('assert');

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
})
