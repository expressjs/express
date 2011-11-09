
var express = require('../')
  , request = require('./support/http')
  , assert = require('assert');

describe('res', function(){
  describe('.sendfile(path)', function(){
    describe('with an absolute path', function(){
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
    
    describe('with a relative path', function(){
      it('should transfer the file', function(done){
        var app = express();

        app.use(function(req, res){
          res.sendfile('test/fixtures/user.html');
        });

        request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('<p>{{user.name}}</p>');
          res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
          done();
        });
      })
      
      it('should next(404) when not found', function(done){
        var app = express()
          , calls = 0;

        app.use(function(req, res){
          res.sendfile('user.html');
        });

        app.use(function(req, res){
          assert(0, 'this should not be called');
        });
        
        app.use(function(err, req, res, next){
          ++calls;
          next(err);
        });

        request(app)
        .get('/')
        .end(function(res){
          res.statusCode.should.equal(404);
          calls.should.equal(1);
          done();
        });
      })
    })
  })
})
