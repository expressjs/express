
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsLanguage', function(){
    it('should be true if language accpeted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsLanguage('en-us').should.be.true;
        req.acceptsLanguage('en').should.be.true;
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Language', 'en;q=.5, en-us')
      .expect(200, done);
    })

    it('should be false if language not accpeted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsLanguage('es').should.be.false;
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Language', 'en;q=.5, en-us')
      .expect(200, done);
    })

    describe('when Accept-Language is not present', function(){
      it('should always return true', function(done){
        var app = express();

        app.use(function(req, res){
          req.acceptsLanguage('en').should.be.true;
          req.acceptsLanguage('es').should.be.true;
          req.acceptsLanguage('jp').should.be.true;
          res.end();
        });

        request(app)
        .get('/')
        .expect(200, done);
      })
    })
  })
})
