'use strict'

var assert = require('node:assert')
var express = require('../')
  , request = require('supertest');
var qs = require('qs');

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

      it('should not be able to access object prototype properties', function (done) {
        var app = createApp('extended', true);

        request(app)
        .get('/?foo=yee')
        .expect(200, /TypeError: req\.query\.hasOwnProperty is not a function/, done);
      });

      it('should be able to use object prototype property names as keys', function (done) {
        var app = createApp('extended', true);

        request(app)
        .get('/?hasOwnProperty=yee')
        .expect(200, '{"query":{"hasOwnProperty":"yee"},"error":"TypeError: req.query.hasOwnProperty is not a function"}', done);
      });
    });

    describe('when "query parser" is simple', function () {
      it('should not parse complex keys', function (done) {
        var app = createApp('simple');

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"user[name]":"tj"}', done);
      });

      it('should not be able to access object prototype properties', function (done) {
        var app = createApp('simple', true);

        request(app)
        .get('/?foo=yee')
        .expect(200, /TypeError: req\.query\.hasOwnProperty is not a function/, done);
      });

      it('should be able to use object prototype property names as keys', function (done) {
        var app = createApp('simple', true);

        request(app)
        .get('/?hasOwnProperty=yee')
        .expect(200, '{"query":{"hasOwnProperty":"yee"},"error":"TypeError: req.query.hasOwnProperty is not a function"}', done);
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

      // test exists to verify behavior for folks wishing to workaround our qs defaults
      it('should drop object prototype property names and be able to access object prototype properties', function (done) {
        var app = createApp(
          function (str) {
            return qs.parse(str)
          }, true);

        request(app)
        .get('/?hasOwnProperty=biscuits')
        .expect(200, '{"query":{},"hasOwnProperty":false}', done);
      });
    });

    describe('when "query parser" disabled', function () {
      it('should not parse query', function (done) {
        var app = createApp(false);

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{}', done);
      });

      it('should not be able to access object prototype properties', function (done) {
        var app = createApp('extended', true);

        request(app)
        .get('/?foo=yee')
        .expect(200, /TypeError: req\.query\.hasOwnProperty is not a function/, done);
      });

      it('should be able to use object prototype property names as keys', function (done) {
        var app = createApp('extended', true);

        request(app)
        .get('/?hasOwnProperty=yee')
        .expect(200, '{"query":{"hasOwnProperty":"yee"},"error":"TypeError: req.query.hasOwnProperty is not a function"}', done);
      });
    });

    describe('when "query parser" enabled', function () {
      it('should not parse complex keys', function (done) {
        var app = createApp(true);

        request(app)
        .get('/?user%5Bname%5D=tj')
        .expect(200, '{"user[name]":"tj"}', done);
      });

      it('should not be able to access object prototype properties', function (done) {
        var app = createApp('extended', true);

        request(app)
        .get('/?foo=yee')
        .expect(200, /TypeError: req\.query\.hasOwnProperty is not a function/, done);
      });

      it('should be able to use object prototype property names as keys', function (done) {
        var app = createApp('extended', true);

        request(app)
        .get('/?hasOwnProperty=yee')
        .expect(200, '{"query":{"hasOwnProperty":"yee"},"error":"TypeError: req.query.hasOwnProperty is not a function"}', done);
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

function createApp(setting, isPrototypePropertyTest) {
  var app = express();

  if (setting !== undefined) {
    app.set('query parser', setting);
  }

  app.use(function (req, res) {
    if(isPrototypePropertyTest) {
      try {
        var hasOwnProperty = req.query.hasOwnProperty('✨ express ✨');
        res.send({ query: req.query, hasOwnProperty: hasOwnProperty });
      } catch (error) {
        res.send({ query: req.query, error: error.toString() });
      }
    }
    else {
      res.send(req.query);
    }
  });

  return app;
}
