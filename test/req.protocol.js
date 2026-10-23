'use strict'

var assert = require('node:assert')
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.protocol', function(){
    it('should return the protocol string', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.protocol);
      });

      request(app)
      .get('/')
      .expect('http', done);
    })

    describe('when "trust proxy" is enabled', function(){
      it('should respect X-Forwarded-Proto', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('https', done);
      })

      it('should default to the socket addr if X-Forwarded-Proto not present', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          req.socket.encrypted = true;
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .expect('https', done);
      })

      it('should ignore X-Forwarded-Proto if socket addr not trusted', function(done){
        var app = express();

        app.set('trust proxy', '10.0.0.1');

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('http', done);
      })

      it('should default to http', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .expect('http', done);
      })

      describe('when trusting hop count', function () {
        it('should respect X-Forwarded-Proto', function (done) {
          var app = express();

          app.set('trust proxy', 1);

          app.use(function (req, res) {
            res.end(req.protocol);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('https', done);
        })
      })
    })

    describe('when "trust proxy" is disabled', function(){
      it('should ignore X-Forwarded-Proto', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('http', done);
      })
    })
  })
})

describe('req', function(){
  describe('.protocol caching', function(){
    function mockReq (app, addr, headers, encrypted) {
      var req = Object.create(app.request)
      req.app = app
      req.headers = headers || {}
      req.socket = { remoteAddress: addr, encrypted: encrypted }
      return req
    }

    function countingTrust (app, result) {
      var state = { calls: 0 }
      app.set('trust proxy', function () {
        state.calls++
        return result
      })
      return state
    }

    it('should return the same value when read repeatedly', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'https')
      assert.strictEqual(req.protocol, 'https')
    })

    it('should only run the trust function once for repeated reads', function(){
      var app = express()
      var trust = countingTrust(app, true)
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      req.protocol
      req.protocol
      req.protocol
      assert.strictEqual(trust.calls, 1)
    })

    it('should only run the trust function once for protocol and secure', function(){
      var app = express()
      var trust = countingTrust(app, true)
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'https')
      assert.strictEqual(req.secure, true)
      assert.strictEqual(trust.calls, 1)
    })

    it('should cache an untrusted result', function(){
      var app = express()
      var trust = countingTrust(app, false)
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'http')
      assert.strictEqual(req.protocol, 'http')
      assert.strictEqual(trust.calls, 1)
    })

    it('should call the trust function with hop 0 and the socket address', function(){
      var app = express()
      var seen = []
      app.set('trust proxy', function (addr, i) {
        seen.push([addr, i])
        return true
      })
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      req.protocol
      assert.deepStrictEqual(seen, [['10.0.0.1', 0]])
    })

    it('should reflect X-Forwarded-Proto changes', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'https')

      req.headers['x-forwarded-proto'] = 'http'
      assert.strictEqual(req.protocol, 'http')
    })

    it('should reflect the first value of a multi-value X-Forwarded-Proto', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https, http' })

      assert.strictEqual(req.protocol, 'https')
      assert.strictEqual(req.protocol, 'https')
    })

    it('should update when the socket address changes', function(){
      var app = express()
      app.set('trust proxy', '10.0.0.0/8')
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'https')

      req.socket.remoteAddress = '192.168.1.1'
      assert.strictEqual(req.protocol, 'http')

      req.socket.remoteAddress = '10.0.0.2'
      assert.strictEqual(req.protocol, 'https')
    })

    it('should update when "trust proxy" is enabled after the first read', function(){
      var app = express()
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'http')

      app.set('trust proxy', true)
      assert.strictEqual(req.protocol, 'https')
    })

    it('should update when "trust proxy" is disabled after the first read', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'https')

      app.set('trust proxy', false)
      assert.strictEqual(req.protocol, 'http')
    })

    it('should update when the trusted subnet list changes', function(){
      var app = express()
      app.set('trust proxy', '10.0.0.0/8')
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'https')

      app.set('trust proxy', '192.168.0.0/16')
      assert.strictEqual(req.protocol, 'http')
    })

    it('should return https for an encrypted socket regardless of the cache', function(){
      var app = express()
      var req = mockReq(app, '10.0.0.1', {}, true)

      assert.strictEqual(req.protocol, 'https')
      assert.strictEqual(req.protocol, 'https')
    })

    it('should not share between requests', function(){
      var app = express()
      app.set('trust proxy', '10.0.0.0/8')
      var trusted = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })
      var untrusted = mockReq(app, '192.168.1.1', { 'x-forwarded-proto': 'https' })

      assert.strictEqual(trusted.protocol, 'https')
      assert.strictEqual(untrusted.protocol, 'http')
      assert.strictEqual(trusted.protocol, 'https')
    })

    it('should not share between apps', function(){
      var trusting = express()
      var strict = express()
      trusting.set('trust proxy', true)

      assert.strictEqual(mockReq(trusting, '10.0.0.1', { 'x-forwarded-proto': 'https' }).protocol, 'https')
      assert.strictEqual(mockReq(strict, '10.0.0.1', { 'x-forwarded-proto': 'https' }).protocol, 'http')
    })

    it('should not cache when the trust function throws', function(){
      var app = express()
      var calls = 0
      app.set('trust proxy', function () {
        if (++calls === 1) throw new Error('boom')
        return true
      })
      var req = mockReq(app, '10.0.0.1', { 'x-forwarded-proto': 'https' })

      assert.throws(function () { req.protocol }, /boom/)
      assert.strictEqual(req.protocol, 'https')
    })

    it('should work with a real request', function(done){
      var app = express()
      app.set('trust proxy', true)

      app.use(function(req, res){
        res.send([req.protocol, req.protocol, String(req.secure)].join(','))
      })

      request(app)
      .get('/')
      .set('X-Forwarded-Proto', 'https')
      .expect(200, 'https,https,true', done)
    })
  })
})
