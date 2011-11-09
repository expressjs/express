
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.attachment()', function(){
    it('should Content-Disposition to attachment', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment().send('foo');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-disposition', 'attachment');
        done();
      })
    })
  })
  
  describe('.attachment(filename)', function(){
    it('should add the filename param', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/path/to/image.png');
        res.send('foo');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-disposition', 'attachment; filename="image.png"');
        done();
      })
    })
    
    it('should set the Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/path/to/image.png');
        res.send('foo');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'image/png');
        done();
      })
    })
  })
})
