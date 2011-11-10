
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.cache(str)', function(){
    it('should set Cache-Control', function(done){
      var app = express();

      app.use(function(req, res){
        res.cache('public, max-age=3000').end('whoop');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers['cache-control'].should.equal('public, max-age=3000');
        res.body.should.equal('whoop');
        done();
      })
    })
  })
})
