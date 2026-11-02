'use strict'

var assert = require('node:assert')
var express = require('../')
  , request = require('supertest')

describe('req', function(){
  describe('.host', function(){
    it('should return the Host when present', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com')
      .expect('example.com', done);
    })

    it('should strip port number', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com:3000')
      .expect(200, 'example.com:3000', done);
    })

    it('should return undefined otherwise', function(done){
      var app = express();

      app.use(function(req, res){
        req.headers.host = null;
        res.end(String(req.host));
      });

      request(app)
      .post('/')
      .expect('undefined', done);
    })

    it('should work with IPv6 Host', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]')
      .expect('[::1]', done);
    })

    it('should work with IPv6 Host and port', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]:3000')
      .expect(200, '[::1]:3000', done);
    })

    describe('when "trust proxy" is enabled', function(){
      it('should respect X-Forwarded-Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('example.com', done);
      })

      it('should ignore X-Forwarded-Host if socket addr not trusted', function(done){
        var app = express();

        app.set('trust proxy', '10.0.0.1');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('localhost', done);
      })

      it('should default to Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('example.com', done);
      })

      describe('when trusting hop count', function () {
        it('should respect X-Forwarded-Host', function (done) {
          var app = express();

          app.set('trust proxy', 1);

          app.use(function (req, res) {
            res.end(req.host);
          });

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com')
          .expect('example.com', done);
        })
      })
    })

    describe('when "trust proxy" is disabled', function(){
      it('should ignore X-Forwarded-Host', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'evil')
        .expect('localhost', done);
      })
    })
  })
})

describe('req', function(){
  describe('.host caching', function(){
    function mockReq (app, addr, headers) {
      var req = Object.create(app.request)
      req.app = app
      req.headers = headers || {}
      req.socket = { remoteAddress: addr }
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
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.strictEqual(req.host, 'public.example.com')
      assert.strictEqual(req.host, 'public.example.com')
    })

    it('should only run the trust function once for repeated reads', function(){
      var app = express()
      var trust = countingTrust(app, true)
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      req.host
      req.host
      req.host
      assert.strictEqual(trust.calls, 1)
    })

    it('should only run the trust function once for host, hostname and subdomains', function(){
      var app = express()
      var trust = countingTrust(app, true)
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'a.b.example.com:8080' })

      assert.strictEqual(req.host, 'a.b.example.com:8080')
      assert.strictEqual(req.hostname, 'a.b.example.com')
      assert.deepStrictEqual(req.subdomains, ['b', 'a'])
      assert.strictEqual(trust.calls, 1)
    })

    it('should share the trust result with req.protocol', function(){
      var app = express()
      var trust = countingTrust(app, true)
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com', 'x-forwarded-proto': 'https' })

      assert.strictEqual(req.protocol, 'https')
      assert.strictEqual(req.host, 'public.example.com')
      assert.strictEqual(trust.calls, 1)
    })

    it('should not run the trust function without X-Forwarded-Host', function(){
      var app = express()
      var trust = countingTrust(app, true)
      var req = mockReq(app, '10.0.0.1', { host: 'internal' })

      assert.strictEqual(req.host, 'internal')
      assert.strictEqual(req.host, 'internal')
      assert.strictEqual(trust.calls, 0)
    })

    it('should cache an untrusted result and use Host', function(){
      var app = express()
      var trust = countingTrust(app, false)
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.strictEqual(req.host, 'internal')
      assert.strictEqual(req.host, 'internal')
      assert.strictEqual(trust.calls, 1)
    })

    it('should reflect X-Forwarded-Host changes', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'one.example.com' })

      assert.strictEqual(req.host, 'one.example.com')

      req.headers['x-forwarded-host'] = 'two.example.com'
      assert.strictEqual(req.host, 'two.example.com')
    })

    it('should reflect Host changes', function(){
      var app = express()
      var req = mockReq(app, '10.0.0.1', { host: 'one.example.com' })

      assert.strictEqual(req.host, 'one.example.com')

      req.headers.host = 'two.example.com'
      assert.strictEqual(req.host, 'two.example.com')
    })

    it('should use the first value of a multi-value X-Forwarded-Host', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'first.example.com , second.example.com' })

      assert.strictEqual(req.host, 'first.example.com')
      assert.strictEqual(req.host, 'first.example.com')
    })

    it('should update when the socket address changes', function(){
      var app = express()
      app.set('trust proxy', '10.0.0.0/8')
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.strictEqual(req.host, 'public.example.com')

      req.socket.remoteAddress = '192.168.1.1'
      assert.strictEqual(req.host, 'internal')

      req.socket.remoteAddress = '10.0.0.2'
      assert.strictEqual(req.host, 'public.example.com')
    })

    it('should update when "trust proxy" is enabled after the first read', function(){
      var app = express()
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.strictEqual(req.host, 'internal')

      app.set('trust proxy', true)
      assert.strictEqual(req.host, 'public.example.com')
    })

    it('should update when "trust proxy" is disabled after the first read', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.strictEqual(req.host, 'public.example.com')

      app.set('trust proxy', false)
      assert.strictEqual(req.host, 'internal')
    })

    it('should update when the trusted subnet list changes', function(){
      var app = express()
      app.set('trust proxy', '10.0.0.0/8')
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.strictEqual(req.host, 'public.example.com')

      app.set('trust proxy', '192.168.0.0/16')
      assert.strictEqual(req.host, 'internal')
    })

    it('should return undefined without any host header', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', {})

      assert.strictEqual(req.host, undefined)
      assert.strictEqual(req.host, undefined)
    })

    it('should not share between requests', function(){
      var app = express()
      app.set('trust proxy', '10.0.0.0/8')
      var trusted = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })
      var untrusted = mockReq(app, '192.168.1.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.strictEqual(trusted.host, 'public.example.com')
      assert.strictEqual(untrusted.host, 'internal')
      assert.strictEqual(trusted.host, 'public.example.com')
    })

    it('should not share between apps', function(){
      var trusting = express()
      var strict = express()
      trusting.set('trust proxy', true)
      var headers = { host: 'internal', 'x-forwarded-host': 'public.example.com' }

      assert.strictEqual(mockReq(trusting, '10.0.0.1', headers).host, 'public.example.com')
      assert.strictEqual(mockReq(strict, '10.0.0.1', headers).host, 'internal')
    })

    it('should not cache when the trust function throws', function(){
      var app = express()
      var calls = 0
      app.set('trust proxy', function () {
        if (++calls === 1) throw new Error('boom')
        return true
      })
      var req = mockReq(app, '10.0.0.1', { host: 'internal', 'x-forwarded-host': 'public.example.com' })

      assert.throws(function () { req.host }, /boom/)
      assert.strictEqual(req.host, 'public.example.com')
    })

    it('should work with a real request', function(done){
      var app = express()
      app.set('trust proxy', true)

      app.use(function(req, res){
        res.send([req.host, req.hostname, req.host].join(','))
      })

      request(app)
      .get('/')
      .set('X-Forwarded-Host', 'public.example.com:8080')
      .expect(200, 'public.example.com:8080,public.example.com,public.example.com:8080', done)
    })
  })
})
