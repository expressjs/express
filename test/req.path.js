'use strict'

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.pathname', function(){
    it('should return the parsed pathname', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.pathname);
      });

      request(app)
      .get('/login?redirect=/post/1/comments')
      .expect('/login', done);
    })
  })
})
