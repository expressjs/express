
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.type(str)', function(){
    it('should set the Content-Type based on a filename', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('foo.js').end('var name = "tj";');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'application/javascript');
        done();
      })
    })
  })
})
