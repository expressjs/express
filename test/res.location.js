
var express = require('../')
  , request = require('supertest');

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
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
  })
})
