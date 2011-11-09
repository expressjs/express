
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.sendfile(path)', function(){
    var res;

    beforeEach(function(done){
      var app = express();

      app.use(function(req, res){
        res.sendfile(__dirname + '/fixtures/user.html');
      });

      request(app)
      .get('/')
      .end(function(s){
        res = s;
        done();
      })
    })

    it('should transfer the given file', function(){
      res.body.should.equal('<p>{{user.name}}</p>');
    })
    
    it('should set the Content-Type', function(){
      res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
    })
  })
})
