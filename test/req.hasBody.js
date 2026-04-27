'use strict'

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.hasBody', function(){
    before(function () {
      this.app = express()
      this.app.all('/', function (req, res) {
        res.send(req.hasBody)
      })
    })

    it('should return true when Content-Length > 0', function(done){
      request(this.app)
        .post('/')
        .set('Content-Length', '10')
        .send('test body')
        .expect(200, 'true', done)
    })

    it('should return false when Content-Length: 0', function(done){
      request(this.app)
        .get('/')
        .set('Content-Length', '0')
        .expect(200, 'false', done)
    })

    it('should return true when Transfer-Encoding: chunked', function(done){
      request(this.app)
        .post('/')
        .set('Transfer-Encoding', 'chunked')
        .expect(200, 'true', done)
    })

    it('should return false when no content headers', function(done){
      request(this.app)
        .get('/')
        .expect(200, 'false', done)
    })
  })
})