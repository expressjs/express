var express = require('../')
  , request = require('./support/http');

describe('app', function(){
  describe('.get', function(){
    it('should only call an error handling routing callback when an error is propagated', function(done){
      var app = express();

      app.get('/', function(req, res, next){
        req.thruSecondCallback = false;
        req.thruThirdCallback = false;
        req.thruFourthCallback = false;
        next(new Error('fabricated error'));
      }, function(req, res, next) {
        req.thruSecondCallback = true;
        next();
      }, function(err, req, res, next){
        err.message.should.equal('fabricated error');
        req.thruThirdCallback = true;
        next();
      }, function(err, req, res, next){
        req.thruFourthCallback = true;
        next();
      }, function(req, res){
        req.thruSecondCallback.should.equal(false);
        req.thruThirdCallback.should.equal(true);
        req.thruFourthCallback.should.equal(false);
        res.status(204);
        res.end();
      });

      request(app)
      .get('/')
      .expect(204, done);
    })
  })
})
