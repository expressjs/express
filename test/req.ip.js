'use strict'

var assert = require('node:assert')
  , express = require('../')
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

    describe('when "trust proxy" is a function', function(){
      it('should be called once per hop with an incrementing index', function(done){
        var app = express();
        var calls = [];

        app.set('trust proxy', function (addr, i) {
          calls.push([addr, i]);
          return true;
        });

        app.use(function(req, res, next){
          res.send(req.ip);
        });

        var test = request(app).get('/')
        var socketAddr = getExpectedClientAddress(test._server)
        test.set('X-Forwarded-For', '10.0.0.1, 10.0.0.2, 10.0.0.3')
        test.expect(200, '10.0.0.1', function (err) {
          if (err) return done(err);
          // addrs[0] is the socket address (i === 0), then each
          // X-Forwarded-For hop outward toward the original client.
          // The last address is never passed to the trust function.
          assert.deepEqual(calls, [
            [socketAddr, 0],
            ['10.0.0.3', 1],
            ['10.0.0.2', 2]
          ]);
          done();
        })
      })

      it('should resolve req.ip to the first untrusted hop', function(done){
        var app = express();

        // trust every hop except 10.0.0.2, which becomes the boundary
        app.set('trust proxy', function (addr) {
          return addr !== '10.0.0.2';
        });

        app.use(function(req, res, next){
          res.send(req.ip);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-For', '10.0.0.1, 10.0.0.2, 10.0.0.3')
        .expect(200, '10.0.0.2', done);
      })

      it('should not be called when X-Forwarded-For is not present', function(done){
        var app = express();
        var calls = [];

        app.set('trust proxy', function (addr, i) {
          calls.push([addr, i]);
          return true;
        });

        app.use(function(req, res, next){
          res.send(req.ip);
        });

        var test = request(app).get('/')
        test.expect(200, getExpectedClientAddress(test._server), function (err) {
          if (err) return done(err);
          assert.strictEqual(calls.length, 0);
          done();
        })
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
