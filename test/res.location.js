
var express = require('../')
  , request = require('supertest')
  , should = require('should');

describe('res', function(){
  describe('.location(url)', function(){
    it('should set the header', function(done){
      var app = express();

      app.use(function(req, res){
        res.location('http://google.com').end();
      });

      request(app)
      .get('/')
      .end(function(err, res){
        should(res.headers).have.property('location', 'http://google.com');
        done();
      })
    })
  })
})
