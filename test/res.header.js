
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.header(field)', function(){
    it('should get the response header field', function(done){
      var app = express();

      app.use(function(req, res){
        res.setHeader('Content-Type', 'text/x-foo');
        res.end(res.header('Content-Type'));
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('text/x-foo');
        done();
      })
    })
  })
  
  describe('.header(field, value)', function(){
    it('should set the response header field', function(done){
      var app = express();

      app.use(function(req, res){
        res.header('Content-Type', 'text/x-foo');
        res.end();
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'text/x-foo');
        done();
      })
    })
  })
})
