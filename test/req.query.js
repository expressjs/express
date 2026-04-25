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

      it('should parse more than 20 array parameters as array', function (done) {
        var app = createApp('extended');
        // 25 tenancyIds values - more than the default qs arrayLimit of 20
        var query = 'tenancyIds=35&tenancyIds=28&tenancyIds=149&tenancyIds=157&tenancyIds=158&tenancyIds=159&tenancyIds=161&tenancyIds=160&tenancyIds=162&tenancyIds=163&tenancyIds=164&tenancyIds=165&tenancyIds=166&tenancyIds=167&tenancyIds=7&tenancyIds=196&tenancyIds=195&tenancyIds=198&tenancyIds=70&tenancyIds=6&tenancyIds=75&tenancyIds=76&tenancyIds=77&tenancyIds=78&tenancyIds=79';

        request(app)
        .get('/?' + query)
        .expect(200, '{"tenancyIds":["35","28","149","157","158","159","161","160","162","163","164","165","166","167","7","196","195","198","70","6","75","76","77","78","79"]}', done);
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
