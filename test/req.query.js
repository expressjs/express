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

// regression test for issue #7147
// req.query was returning a plain object (not an array) when a repeated
// query param had more than 20 values — caused by qs defaulting arrayLimit to 20
describe('regression: issue #7147 — arrays with more than 20 values', function () {
  it('should parse 21 repeated query params as an array, not an object', function (done) {
    var app = createApp('extended');

    // Build ?ids=0&ids=1&...&ids=20  (21 values)
    var query = Array.from({ length: 21 }, function (_, i) { return 'ids=' + i; }).join('&');

    request(app)
      .get('/?' + query)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var parsed = JSON.parse(res.text);
        assert.ok(Array.isArray(parsed.ids),
          'req.query.ids should be an Array, got: ' + JSON.stringify(parsed.ids));
        assert.strictEqual(parsed.ids.length, 21);
        done();
      });
  });

  it('should parse 100 repeated query params as an array', function (done) {
    var app = createApp('extended');

    var query = Array.from({ length: 100 }, function (_, i) { return 'ids=' + i; }).join('&');

    request(app)
      .get('/?' + query)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var parsed = JSON.parse(res.text);
        assert.ok(Array.isArray(parsed.ids),
          'req.query.ids should be an Array, got: ' + typeof parsed.ids);
        assert.strictEqual(parsed.ids.length, 100);
        done();
      });
  });

  it('should still parse 20 or fewer repeated params as an array', function (done) {
    var app = createApp('extended');

    var query = Array.from({ length: 20 }, function (_, i) { return 'ids=' + i; }).join('&');

    request(app)
      .get('/?' + query)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var parsed = JSON.parse(res.text);
        assert.ok(Array.isArray(parsed.ids),
          'req.query.ids should be an Array for 20 items');
        assert.strictEqual(parsed.ids.length, 20);
        done();
      });
  });
});
