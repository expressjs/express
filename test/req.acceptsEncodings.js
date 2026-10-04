'use strict'

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsEncodings(encoding)', function () {
    it('should return encoding if accepted', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send({
          gzip: req.acceptsEncodings('gzip'),
          deflate: req.acceptsEncodings('deflate')
        })
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', ' gzip, deflate')
        .expect(200, { gzip: 'gzip', deflate: 'deflate' }, done)
    })

    it('should be false if encoding not accepted', function(done){
      var app = express();

      app.get('/', function (req, res) {
        res.send({
          bogus: req.acceptsEncodings('bogus')
        })
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', ' gzip, deflate')
        .expect(200, { bogus: false }, done)
    })

    it('should accept any encoding when Accept-Encoding is not present', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send({
          bogus: req.acceptsEncodings('bogus')
        })
      })

      request(app)
        .get('/')
        .expect(200, { bogus: 'bogus' }, done)
    })
  })

  describe('.acceptsEncodings(encodings)', function () {
    it('should accept an array of encodings', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send(req.acceptsEncodings(['deflate', 'gzip']))
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip;q=0.5, deflate')
        .expect(200, 'deflate', done)
    })

    it('should accept an argument list of encodings', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send(req.acceptsEncodings('gzip', 'deflate'))
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip, deflate')
        .expect(200, 'gzip', done)
    })
  })

  describe('.acceptsEncodings()', function () {
    it('should return an array of accepted encodings in order of client\'s preference', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send(req.acceptsEncodings())
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip;q=0.5, deflate')
        .expect(200, ['deflate', 'gzip', 'identity'], done)
    })

    it('should respect the priority of identity encoding if specified', function (done) {
      var app = express();

      app.get('/', function (req, res,) {
        res.send(req.acceptsEncodings())
      });

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip;q=0.5, deflate, identity; q=0.7')
        .expect(200, ['deflate', 'identity', 'gzip'], done)
    })

    it('should not return encodings with q=0', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send(req.acceptsEncodings())
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip;q=0.5, deflate, identity; q=0, br;q=0')
        .expect(200, ['deflate', 'gzip'], done)
    })

    it('should not return identity with *;q=0 and no explicit identity encoding', function (done) {
      var app = express();

      app.get('/', function(req, res) {
        res.send(req.acceptsEncodings())
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip;q=0.5, deflate, *;q=0')
        .expect(200, ['deflate', 'gzip'], done)
    })
  })
})
