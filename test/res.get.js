
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.get(field)', function(){
    it('should get the response header field', function(done){
      var app = express();

      app.use(function(req, res){
        res.setHeader('Content-Type', 'text/x-foo');
        res.end(res.get('Content-Type'));
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('text/x-foo');
        done();
      })
    })
  })
})
