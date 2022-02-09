'use strict'

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsEncoding', function(){
    it('should return encoding if accepted', function (done) {
      var app = express();

      app.get('/', function (req, res) {
        res.send({
          gzip: req.acceptsEncoding('gzip'),
          deflate: req.acceptsEncoding('deflate')
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
          bogus: req.acceptsEncoding('bogus')
        })
      })

      request(app)
        .get('/')
        .set('Accept-Encoding', ' gzip, deflate')
        .expect(200, { bogus: false }, done)
    })
  })
})
