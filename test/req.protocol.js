
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.protocol(trustProxy)', function(){
    it('should return the protocol string', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.protocol());
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('http');
        done();
      })
    })

    describe('when trustProxy is true', function(){
      it('should respect X-Forwarded-Proto', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.protocol(true));
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .end(function(res){
          res.body.should.equal('https');
          done();
        })
      })

      it('should default to http', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.protocol(true));
        });

        request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('http');
          done();
        })
      })
    })

    describe('when trustProxy is false', function(){
      it('should ignore X-Forwarded-Proto', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.protocol());
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .end(function(res){
          res.body.should.equal('http');
          done();
        })
      })
    })
  })
})
