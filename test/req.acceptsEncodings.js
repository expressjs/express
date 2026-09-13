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
        .set('Accept-Encoding', 'gzip, deflate')
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
        .set('Accept-Encoding', 'gzip, deflate')
        .expect(200, { bogus: false }, done)
    })

    it('should return the best matching encoding from multiple options', function(done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send({
          best: req.acceptsEncodings('br', 'gzip', 'deflate')
        })
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip, deflate')
        .expect(200, { best: 'gzip' }, done)
    });

    it('should handle multiple encodings correctly', function(done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send({
          result: req.acceptsEncodings('gzip', 'deflate', 'br')
        })
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200, { result: 'gzip' }, done)
    });
  })
})
