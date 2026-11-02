'use strict'

var assert = require('node:assert')
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.ip', function(){
    describe('when X-Forwarded-For is present', function(){
      describe('when "trust proxy" is enabled', function(){
        it('should return the client addr', function(done){
          var app = express();

          app.enable('trust proxy');

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('client', done);
        })

        it('should return the addr after trusted proxy based on count', function (done) {
          var app = express();

          app.set('trust proxy', 2);

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('p1', done);
        })

        it('should return the addr after trusted proxy based on list', function (done) {
          var app = express()

          app.set('trust proxy', '10.0.0.1, 10.0.0.2, 127.0.0.1, ::1')

          app.get('/', function (req, res) {
            res.send(req.ip)
          })

          request(app)
            .get('/')
            .set('X-Forwarded-For', '10.0.0.2, 10.0.0.3, 10.0.0.1', '10.0.0.4')
            .expect('10.0.0.3', done)
        })

        it('should return the addr after trusted proxy, from sub app', function (done) {
          var app = express();
          var sub = express();

          app.set('trust proxy', 2);
          app.use(sub);

          sub.use(function (req, res, next) {
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect(200, 'p1', done);
        })
      })

      describe('when "trust proxy" is disabled', function(){
        it('should return the remote address', function(done){
          var app = express();

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          var test = request(app).get('/')
          test.set('X-Forwarded-For', 'client, p1, p2')
          test.expect(200, getExpectedClientAddress(test._server), done);
        })
      })
    })

    describe('when X-Forwarded-For is not present', function(){
      it('should return the remote address', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res, next){
          res.send(req.ip);
        });

        var test = request(app).get('/')
        test.expect(200, getExpectedClientAddress(test._server), done)
      })
    })
  })
})

/**
 * Get the local client address depending on AF_NET of server
 */

function getExpectedClientAddress(server) {
  return server.address().address === '::'
    ? '::ffff:127.0.0.1'
    : '127.0.0.1';
}

describe('req', function(){
  describe('.ip caching', function(){
    function mockReq (app, addr, forwarded) {
      var req = Object.create(app.request)
      req.app = app
      req.headers = {}
      if (forwarded !== undefined) req.headers['x-forwarded-for'] = forwarded
      req.socket = { remoteAddress: addr }
      return req
    }

    it('should return the same value when read repeatedly', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', 'client, p1')

      assert.strictEqual(req.ip, 'client')
      assert.strictEqual(req.ip, 'client')
      assert.strictEqual(req.ip, 'client')
    })

    it('should only run a custom trust function for the first read', function(){
      var app = express()
      var calls = 0
      app.set('trust proxy', function () {
        calls++
        return true
      })
      var req = mockReq(app, '10.0.0.1', 'client, p1, p2')

      req.ip
      var after = calls
      assert.ok(after > 0)

      req.ip
      req.ip
      assert.strictEqual(calls, after)
    })

    it('should return the socket address when "trust proxy" is disabled', function(){
      var app = express()
      var req = mockReq(app, '10.0.0.1', 'client, p1')

      assert.strictEqual(req.ip, '10.0.0.1')
      assert.strictEqual(req.ip, '10.0.0.1')
    })

    it('should return the socket address when there is no X-Forwarded-For', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1')

      assert.strictEqual(req.ip, '10.0.0.1')
      assert.strictEqual(req.ip, '10.0.0.1')
    })

    it('should return undefined without a socket address', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, undefined)

      assert.strictEqual(req.ip, undefined)
      assert.strictEqual(req.ip, undefined)
    })

    it('should update when X-Forwarded-For changes', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', 'first, p1')

      assert.strictEqual(req.ip, 'first')

      req.headers['x-forwarded-for'] = 'second, p1'
      assert.strictEqual(req.ip, 'second')
    })

    it('should update when X-Forwarded-For is removed', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', 'client, p1')

      assert.strictEqual(req.ip, 'client')

      delete req.headers['x-forwarded-for']
      assert.strictEqual(req.ip, '10.0.0.1')
    })

    it('should update when X-Forwarded-For is added', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1')

      assert.strictEqual(req.ip, '10.0.0.1')

      req.headers['x-forwarded-for'] = 'client'
      assert.strictEqual(req.ip, 'client')
    })

    it('should update when the socket address changes', function(){
      var app = express()
      var req = mockReq(app, '10.0.0.1')

      assert.strictEqual(req.ip, '10.0.0.1')

      req.socket.remoteAddress = '10.0.0.2'
      assert.strictEqual(req.ip, '10.0.0.2')
    })

    it('should update when "trust proxy" is enabled after the first read', function(){
      var app = express()
      var req = mockReq(app, '10.0.0.1', 'client, p1')

      assert.strictEqual(req.ip, '10.0.0.1')

      app.set('trust proxy', true)
      assert.strictEqual(req.ip, 'client')
    })

    it('should update when "trust proxy" is disabled after the first read', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', 'client, p1')

      assert.strictEqual(req.ip, 'client')

      app.set('trust proxy', false)
      assert.strictEqual(req.ip, '10.0.0.1')
    })

    it('should update when the trusted hop count changes', function(){
      var app = express()
      app.set('trust proxy', 1)
      var req = mockReq(app, '10.0.0.1', 'client, p1, p2')

      assert.strictEqual(req.ip, 'p2')

      app.set('trust proxy', 2)
      assert.strictEqual(req.ip, 'p1')

      app.set('trust proxy', 3)
      assert.strictEqual(req.ip, 'client')
    })

    it('should update when the trusted subnet list changes', function(){
      var app = express()
      app.set('trust proxy', '10.0.0.0/8')
      var req = mockReq(app, '10.0.0.1', 'client, 10.0.0.2')

      assert.strictEqual(req.ip, 'client')

      app.set('trust proxy', '192.168.0.0/16')
      assert.strictEqual(req.ip, '10.0.0.1')
    })

    it('should not share between requests', function(){
      var app = express()
      app.set('trust proxy', true)
      var one = mockReq(app, '10.0.0.1', 'client-one, p1')
      var two = mockReq(app, '10.0.0.1', 'client-two, p1')

      assert.strictEqual(one.ip, 'client-one')
      assert.strictEqual(two.ip, 'client-two')
      assert.strictEqual(one.ip, 'client-one')
    })

    it('should not share between apps', function(){
      var trusting = express()
      var strict = express()
      trusting.set('trust proxy', true)

      assert.strictEqual(mockReq(trusting, '10.0.0.1', 'client, p1').ip, 'client')
      assert.strictEqual(mockReq(strict, '10.0.0.1', 'client, p1').ip, '10.0.0.1')
    })

    it('should be unaffected by req.ips', function(){
      var app = express()
      app.set('trust proxy', true)
      var req = mockReq(app, '10.0.0.1', 'client, p1')

      assert.deepStrictEqual(req.ips, ['client', 'p1'])
      assert.strictEqual(req.ip, 'client')
      assert.deepStrictEqual(req.ips, ['client', 'p1'])
    })

    it('should not cache when the trust function throws', function(){
      var app = express()
      var calls = 0
      app.set('trust proxy', function () {
        if (++calls === 1) throw new Error('boom')
        return true
      })
      var req = mockReq(app, '10.0.0.1', 'client, p1')

      assert.throws(function () { req.ip }, /boom/)
      assert.strictEqual(req.ip, 'client')
    })

    it('should work with a real request', function(done){
      var app = express()
      app.set('trust proxy', true)

      app.use(function(req, res){
        res.send([req.ip, req.ip, req.ip].join(','))
      })

      request(app)
      .get('/')
      .set('X-Forwarded-For', 'client, p1')
      .expect(200, 'client,client,client', done)
    })
  })
})
