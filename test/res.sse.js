'use strict'

var express = require('../')
  , request = require('supertest')
  , assert = require('node:assert')
  , Readable = require('node:stream').Readable;

const { Buffer } = require('node:buffer');

describe('res', function () {
  describe('.sse()', function () {
    it('should set the event-stream headers', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.sse({ heartbeat: false }).close();
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/event-stream; charset=utf-8')
      .expect('Cache-Control', 'no-cache, no-transform')
      .expect('Connection', 'keep-alive')
      .expect(200, done);
    })

    it('should send a string as a single data field', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        var sse = res.sse({ heartbeat: false });
        sse.send('hello');
        sse.close();
      });

      request(app)
      .get('/')
      .expect(200, 'data: hello\n\n', done);
    })

    it('should serialize objects as JSON', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        var sse = res.sse({ heartbeat: false });
        sse.send({ hello: 'world' });
        sse.close();
      });

      request(app)
      .get('/')
      .expect(200, 'data: {"hello":"world"}\n\n', done);
    })

    it('should decode Buffers as utf-8 text', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        var sse = res.sse({ heartbeat: false });
        sse.send(Buffer.from('café'));
        sse.close();
      });

      request(app)
      .get('/')
      .expect(200, 'data: café\n\n', done);
    })

    it('should write id, event and retry fields', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        var sse = res.sse({ heartbeat: false });
        sse.send('payload', { event: 'update', id: 42, retry: 3000 });
        sse.close();
      });

      request(app)
      .get('/')
      .expect(200, 'id: 42\nevent: update\nretry: 3000\ndata: payload\n\n', done);
    })

    it('should split multi-line data into multiple data fields', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        var sse = res.sse({ heartbeat: false });
        sse.send('line one\nline two');
        sse.close();
      });

      request(app)
      .get('/')
      .expect(200, 'data: line one\ndata: line two\n\n', done);
    })

    it('should write a comment line', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        var sse = res.sse({ heartbeat: false });
        sse.comment('keep-alive');
        sse.close();
      });

      request(app)
      .get('/')
      .expect(200, ': keep-alive\n\n', done);
    })

    it('should be chainable', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.sse({ heartbeat: false })
          .send('a')
          .send('b')
          .close();
      });

      request(app)
      .get('/')
      .expect(200, 'data: a\n\ndata: b\n\n', done);
    })

    describe('.stream()', function () {
      it('should emit one event per chunk of a Node Readable', function (done) {
        var app = express();

        app.get('/', function (req, res) {
          var sse = res.sse({ heartbeat: false });
          sse.stream(Readable.from(['one', 'two'])).then(function () {
            sse.close();
          });
        });

        request(app)
        .get('/')
        .expect(200, 'data: one\n\ndata: two\n\n', done);
      })

      it('should emit one event per chunk of a web ReadableStream', function (done) {
        var app = express();

        app.get('/', function (req, res) {
          var sse = res.sse({ heartbeat: false });
          var source = new ReadableStream({
            start: function (controller) {
              controller.enqueue('a');
              controller.enqueue('b');
              controller.close();
            }
          });
          sse.stream(source, { event: 'chunk' }).then(function () {
            sse.close();
          });
        });

        request(app)
        .get('/')
        .expect(200, 'event: chunk\ndata: a\n\nevent: chunk\ndata: b\n\n', done);
      })

      it('should resolve with the stream instance', function (done) {
        var app = express();

        app.get('/', function (req, res) {
          var sse = res.sse({ heartbeat: false });
          sse.stream(Readable.from(['x'])).then(function (returned) {
            assert.strictEqual(returned, sse);
            sse.close();
          });
        });

        request(app)
        .get('/')
        .expect(200, 'data: x\n\n', done);
      })

      it('should emit one event per chunk of an async iterable', function (done) {
        var app = express();

        app.get('/', function (req, res) {
          var sse = res.sse({ heartbeat: false });
          async function * gen () {
            yield 'a';
            yield 'b';
          }
          sse.stream(gen()).then(function () {
            sse.close();
          });
        });

        request(app)
        .get('/')
        .expect(200, 'data: a\n\ndata: b\n\n', done);
      })

      it('should stream the contents of a Blob', function (done) {
        var app = express();

        app.get('/', function (req, res) {
          var sse = res.sse({ heartbeat: false });
          sse.stream(new Blob(['hello world'])).then(function () {
            sse.close();
          });
        });

        request(app)
        .get('/')
        .expect(200, 'data: hello world\n\n', done);
      })
    })

    it('should not throw when writing after close', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        var sse = res.sse({ heartbeat: false });
        sse.close();
        sse.send('ignored');
      });

      request(app)
      .get('/')
      .expect(200, '', done);
    })
  })
})
