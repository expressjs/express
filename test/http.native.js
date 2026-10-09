'use strict'

var express = require('..');
var http = require('node:http');
var request = require('supertest');
var assert = require('node:assert');

describe('node:http pass-through', function () {
  describe('req', function () {
    it('should inherit from http.IncomingMessage', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.end(String(req instanceof http.IncomingMessage));
      });

      request(app)
        .get('/')
        .expect(200, 'true', done);
    })

    it('should expose req.rawHeaders', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.end(JSON.stringify(req.rawHeaders.indexOf('X-Raw-Case') !== -1));
      });

      request(app)
        .get('/')
        .set('X-Raw-Case', 'yes')
        .expect(200, 'true', done);
    })

    it('should expose req.headersDistinct', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.json(req.headersDistinct['x-foo']);
      });

      request(app)
        .get('/')
        .set('X-Foo', 'bar')
        .expect(200, ['bar'], done);
    })

    it('should expose req.httpVersion', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.end(req.httpVersion);
      });

      request(app)
        .get('/')
        .expect(200, '1.1', done);
    })
  })

  describe('res', function () {
    it('should inherit from http.ServerResponse', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.end(String(res instanceof http.ServerResponse));
      });

      request(app)
        .get('/')
        .expect(200, 'true', done);
    })

    it('should support res.writeHead()', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.writeHead(201, { 'X-Native': 'yes' });
        res.end('created');
      });

      request(app)
        .get('/')
        .expect('X-Native', 'yes')
        .expect(201, 'created', done);
    })

    it('should support res.appendHeader()', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.appendHeader('X-Multi', 'a');
        res.appendHeader('X-Multi', 'b');
        res.end(res.get('X-Multi').join(','));
      });

      request(app)
        .get('/')
        .expect(200, 'a,b', done);
    })

    it('should support res.hasHeader() and res.getHeaderNames()', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('X-Present', '1');
        res.json({
          has: res.hasHeader('x-present'),
          missing: res.hasHeader('x-missing'),
          listed: res.getHeaderNames().indexOf('x-present') !== -1
        });
      });

      request(app)
        .get('/')
        .expect(200, { has: true, missing: false, listed: true }, done);
    })

    it('should support res.flushHeaders()', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('X-Flushed', 'yes');
        res.flushHeaders();
        assert.strictEqual(res.headersSent, true);
        res.end('body');
      });

      request(app)
        .get('/')
        .expect('X-Flushed', 'yes')
        .expect(200, 'body', done);
    })

    it('should support res.addTrailers()', function (done) {
      var app = express();
      var server = http.createServer(app).listen(0, function () {
        http.get({
          port: server.address().port,
          headers: { TE: 'trailers' }
        }, function (res) {
          res.resume();
          res.on('end', function () {
            server.close();
            assert.strictEqual(res.trailers['x-trailer'], 'done');
            done();
          });
        });
      });

      app.use(function (req, res) {
        res.set('Trailer', 'X-Trailer');
        res.write('body');
        res.addTrailers({ 'X-Trailer': 'done' });
        res.end();
      });
    })

    it('should support res.writeEarlyHints()', function (done) {
      var app = express();
      var server = http.createServer(app).listen(0, function () {
        var req = http.get({ port: server.address().port });
        var hinted = false;

        req.on('information', function (info) {
          hinted = info.statusCode === 103;
        });
        req.on('response', function (res) {
          res.resume();
          res.on('end', function () {
            server.close();
            assert.strictEqual(hinted, true);
            done();
          });
        });
      });

      app.use(function (req, res) {
        res.writeEarlyHints({ link: '</style.css>; rel=preload; as=style' });
        res.end('ok');
      });
    })
  })

  describe('app.listen()', function () {
    it('should return an http.Server', function (done) {
      var app = express();
      var server = app.listen(0, function () {
        assert.ok(server instanceof http.Server);
        server.close(done);
      });
    })
  })
})
