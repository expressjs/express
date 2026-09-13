'use strict'

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsEncodings', function () {
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
})
