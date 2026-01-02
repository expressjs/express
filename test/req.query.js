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

    var qs = require('qs');

    describe('when "query parser" enforces arrayLimit on bracket notation', function () {
      it('should returns 500 when throwOnLimitExceeded is enabled and limit is surpassed', function (done) {
        var app = createApp(
          function (str) {
            return qs.parse(str, { allowPrototypes: true, arrayLimit: 2, throwOnLimitExceeded: true } );
          }
        );

        request(app)
          .get('/?a[]=1&a[]=2&a[]=3')
          .expect(function (res) {
            if (Array.isArray(res.body.a) && res.body.a.length > 2) {
              throw new Error('arrayLimit ignored for bracket notation');
            }
          })
          .expect(500, done);
      });

      it('allows arrays up to the arrayLimit without error', function (done) {
        var app = createApp(
          function (str) {
            return qs.parse(str, { allowPrototypes: true, arrayLimit: 2 } );
          }
        );

        request(app)
          .get('/?a[]=1&a[]=2&a[]=3')
          .expect(function (res) {
            if (Array.isArray(res.body.a) && res.body.a.length > 2) {
              throw new Error('arrayLimit ignored for bracket notation');
            }
          })
          .expect(200, done);
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
