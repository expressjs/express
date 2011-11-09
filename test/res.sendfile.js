
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.sendfile(path)', function(){
    it('should transfer the file', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile(__dirname + '/fixtures/user.html');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('<p>{{user.name}}</p>');
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      });
    })
  })
})
