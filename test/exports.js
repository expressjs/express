'use strict'

var assert = require('assert')
var express = require('../');
var request = require('supertest');

describe('exports', function(){
  it('should expose Router', function(){
    assert.strictEqual(typeof express.Router, 'function')
  })

  it('should expose json middleware', function () {
    assert.equal(typeof express.json, 'function')
    assert.equal(express.json.length, 1)
  })

  it('should expose raw middleware', function () {
    assert.equal(typeof express.raw, 'function')
    assert.equal(express.raw.length, 1)
  })

  it('should expose static middleware', function () {
    assert.equal(typeof express.static, 'function')
    assert.equal(express.static.length, 2)
  })

  it('should expose text middleware', function () {
    assert.equal(typeof express.text, 'function')
    assert.equal(express.text.length, 1)
  })

  it('should expose urlencoded middleware', function () {
    assert.equal(typeof express.urlencoded, 'function')
    assert.equal(express.urlencoded.length, 1)
  })

  it('should expose the application prototype', function(){
    assert.strictEqual(typeof express.application, 'object')
    assert.strictEqual(typeof express.application.set, 'function')
  })

  it('should expose the request prototype', function(){
    assert.strictEqual(typeof express.request, 'object')
    assert.strictEqual(typeof express.request.accepts, 'function')
  })

  it('should expose the response prototype', function(){
    assert.strictEqual(typeof express.response, 'object')
    assert.strictEqual(typeof express.response.send, 'function')
  })

  it('should permit modifying the .application prototype', function(){
    express.application.foo = function(){ return 'bar'; };
    assert.strictEqual(express().foo(), 'bar')
  })

  it('should permit modifying the .request prototype', function(done){
    express.request.foo = function(){ return 'bar'; };
    var app = express();

    app.use(function(req, res, next){
      res.end(req.foo());
    });

    request(app)
    .get('/')
    .expect('bar', done);
  })

  it('should permit modifying the .response prototype', function(done){
    express.response.foo = function(){ this.send('bar'); };
    var app = express();

    app.use(function(req, res, next){
      res.foo();
    });

    request(app)
    .get('/')
    .expect('bar', done);
  })

  it('should throw on old middlewares', function(){
    assert.throws(function () { express.bodyParser() }, /Error:.*middleware.*bodyParser/)
    assert.throws(function () { express.limit() }, /Error:.*middleware.*limit/)
  })
})
