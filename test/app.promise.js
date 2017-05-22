
var express = require('../')
  , request = require('supertest');

describe('app', function(){
  describe('.VERB()', function(){
    it('should handle a rejected promise', function(done) {
      // Only run this test in environments where Promise is defined.
      if (!global.Promise) {
        return done();
      }

      var app = express();

      var a = false;
      var b = false;
      var c = false;
      var d = false;

      app.get('/', function(req, res, next){
        return new Promise(function(){
          throw new Error('boom!');
        });
      }, function(req, res, next) {
        return new Promise(function(){
          a = true;
          next();
        });
      }, function(err, req, res, next){
        return new Promise(function(){
          b = true;
          err.message.should.equal('boom!');
          throw err;
        });
      }, function(err, req, res, next){
        return new Promise(function(){
          c = true;
          err.message.should.equal('boom!');
          next();
        });
      }, function(err, req, res, next){
        return new Promise(function(){
          d = true;
          next();
        });
      }, function(req, res){
        a.should.be.false;
        b.should.be.true;
        c.should.be.true;
        d.should.be.false;
        res.send(204);
      });

      request(app)
      .get('/')
      .expect(204, done);
    })
  })
})
