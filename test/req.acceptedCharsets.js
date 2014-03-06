
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptedCharsets', function(){
    it('should return an array of accepted charsets', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptedCharsets[0].should.equal('unicode-1-1');
        req.acceptedCharsets[1].should.equal('iso-8859-5');
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Charset', 'iso-8859-5;q=.2, unicode-1-1;q=0.8')
      .expect(200, done);
    })

    describe('when Accept-Charset is not present', function(){
      it('should default to []', function(done){
        var app = express();

        app.use(function(req, res){
          req.acceptedCharsets.should.have.length(0);
          res.end();
        });

        request(app)
        .get('/')
        .expect(200, done);
      })
    })
  })
})
