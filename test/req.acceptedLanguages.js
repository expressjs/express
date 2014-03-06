
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptedLanguages', function(){
    it('should return an array of accepted languages', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptedLanguages[0].should.equal('en-us');
        req.acceptedLanguages[1].should.equal('en');
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Language', 'en;q=.5, en-us')
      .expect(200, done);
    })

    describe('when Accept-Language is not present', function(){
      it('should default to []', function(done){
        var app = express();

        app.use(function(req, res){
          req.acceptedLanguages.should.have.length(0);
          res.end();
        });

        request(app)
        .get('/')
        .expect(200, done);
      })
    })
  })
})
