'use strict'

var assert = require('node:assert')
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.query', function(){
    it('should default to {}', function(done){
      var app = createApp();

      request(app)
      .get('/')
      .expect(200, '{}', done);
    });

    it('should default to parse simple keys', function (done) {
      var app = createApp();

      request(app)
      .get('/?user[name]=tj')
      .expect(200, '{"user[name]":"tj"}', done);
    });

    describe('when "query parser" is extended', function () {
      it('should parse complex keys', function (done) {
        var app = createApp('extended');

        request(app)
        .get('/?foo[0][bar]=baz&foo[0][fizz]=buzz&foo[]=done!')
        .expect(200, '{"foo":[{"bar":"baz","fizz":"buzz"},"done!"]}', done);
      });

      it('should parse parameters with dots', function (done) {
        var app = createApp('extended');

        request(app)
        .get('/?user.name=tj')
        .expect(200, '{"user.name":"tj"}', done);
      });
    });

    describe('when "query parser" is simple', function () {
      it('should not parse complex keys', function (done) {
        var app = createApp('simple');

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"user[name]":"tj"}', done);
      });
    });

    describe('when "query parser" is a function', function () {
      it('should parse using function', function (done) {
        var app = createApp(function (str) {
          return {'length': (str || '').length};
        });

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"length":17}', done);
      });
    });

    describe('when "query parser" disabled', function () {
      it('should not parse query', function (done) {
        var app = createApp(false);

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{}', done);
      });
    });

    describe('when "query parser" enabled', function () {
      it('should not parse complex keys', function (done) {
        var app = createApp(true);

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"user[name]":"tj"}', done);
      });
    });

    describe('when "query parser" an unknown value', function () {
      it('should throw', function () {
        assert.throws(createApp.bind(null, 'bogus'),
          /unknown value.*query parser/)
      });
    });

    describe('when accessed more than once', function () {
      it('should parse once per request', function (done) {
        var app = express();
        var calls = 0;

        app.set('query parser', function (str) {
          calls++;
          return { str: str };
        });

        app.use(function (req, res) {
          var first = req.query;
          res.send(String(first === req.query) + ' ' + calls);
        });

        request(app)
        .get('/?a=1')
        .expect(200, 'true 1', done);
      });

      it('should not share between requests', function (done) {
        var app = createApp();

        request(app)
        .get('/?a=1')
        .expect(200, '{"a":"1"}', function (err) {
          if (err) return done(err);
          request(app)
          .get('/?a=2')
          .expect(200, '{"a":"2"}', done);
        });
      });

      it('should reparse when req.url changes', function (done) {
        var app = express();

        app.use(function (req, res, next) {
          req.query;
          req.url = '/?b=2';
          next();
        });

        app.use(function (req, res) {
          res.send(req.query);
        });

        request(app)
        .get('/?a=1')
        .expect(200, '{"b":"2"}', done);
      });

      it('should reparse when the "query parser" setting changes', function (done) {
        var app = express();

        app.use(function (req, res) {
          var simple = req.query;
          req.app.set('query parser', 'extended');
          res.send({ simple: simple, extended: req.query });
        });

        request(app)
        .get('/?a[b]=1')
        .expect(200, '{"simple":{"a[b]":"1"},"extended":{"a":{"b":"1"}}}', done);
      });

      it('should keep changes made to the returned object', function (done) {
        var app = express();

        app.use(function (req, res) {
          req.query.extra = 'yes';
          res.send(req.query);
        });

        request(app)
        .get('/?a=1')
        .expect(200, '{"a":"1","extra":"yes"}', done);
      });

      it('should reparse when the "query parser" function changes', function (done) {
        var app = express();

        app.use(function (req, res) {
          var before = req.query;
          req.app.set('query parser', function () {
            return { custom: true };
          });
          res.send({ before: before, after: req.query });
        });

        request(app)
        .get('/?a=1')
        .expect(200, '{"before":{"a":"1"},"after":{"custom":true}}', done);
      });

      it('should not cache when parsing is disabled', function (done) {
        var app = express();

        app.set('query parser', false);

        app.use(function (req, res) {
          res.send(String(req.query === req.query) + ' ' + Object.keys(req.query).length);
        });

        request(app)
        .get('/?a=1')
        .expect(200, 'false 0', done);
      });

      it('should retry after the parser throws', function (done) {
        var app = express();
        var calls = 0;

        app.set('query parser', function () {
          if (++calls === 1) throw new Error('boom');
          return { ok: true };
        });

        app.use(function (req, res) {
          var err;
          try {
            req.query;
          } catch (e) {
            err = e.message;
          }
          res.send({ err: err, query: req.query, calls: calls });
        });

        request(app)
        .get('/?a=1')
        .expect(200, '{"err":"boom","query":{"ok":true},"calls":2}', done);
      });

      it('should work across a mounted sub-app', function (done) {
        var app = express();
        var sub = express();

        app.use(function (req, res, next) {
          req.query;
          next();
        });

        sub.use(function (req, res) {
          res.send(req.query);
        });

        app.use('/sub', sub);

        request(app)
        .get('/sub/path?a=1&b=2')
        .expect(200, '{"a":"1","b":"2"}', done);
      });

      it('should reflect the new query after req.url is rewritten with a mount path', function (done) {
        var app = express();

        app.use('/api', function (req, res, next) {
          req.query;
          req.url = req.url + '&added=1';
          next();
        });

        app.use(function (req, res) {
          res.send(req.query);
        });

        request(app)
        .get('/api/x?a=1')
        .expect(200, '{"a":"1","added":"1"}', done);
      });
    });
  })
})

function createApp(setting) {
  var app = express();

  if (setting !== undefined) {
    app.set('query parser', setting);
  }

  app.use(function (req, res) {
    res.send(req.query);
  });

  return app;
}
