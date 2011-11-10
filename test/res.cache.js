
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.cache(type)', function(){
    it('should set Cache-Control', function(done){
      var app = express();

      app.use(function(req, res){
        res.cache('public').end('whoop');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers['cache-control'].should.equal('public');
        res.body.should.equal('whoop');
        done();
      })
    })
    
    describe('maxAge option', function(){
      it('should accept milliseconds', function(done){
        var app = express();

        app.use(function(req, res){
          res.cache('private', { maxAge: 60 * 1000 }).end();
        });

        request(app)
        .get('/')
        .end(function(res){
          res.headers['cache-control'].should.equal('private, max-age=60');
          done();
        })
      })
    })
  })
})
