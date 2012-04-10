
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
    it('should fallback to application/octet-stream', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('./path/foo.blargh').end('var name = "tj";');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'application/octet-stream');
        done();
      })
    })
    it('should handle literal mime types', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('multipart/encrypted').end('var name = "tj";');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'multipart/encrypted');
        done();
      })
    })
  })
})
