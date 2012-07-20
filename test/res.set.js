
var express = require('../')
  , request = require('./support/http')
  , res = express.response;

describe('res', function(){
  describe('.set(field, value)', function(){
    it('should set the response header field', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/x-foo').end();
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('content-type', 'text/x-foo');
        done();
      })
    })

    it('should coerce to a string', function(){
      res.headers = {};
      res.set('ETag', 123);
      res.get('ETag').should.equal('123');
    })
  })
  
  describe('.set(object)', function(){
    it('should set multiple fields', function(done){
      var app = express();

      app.use(function(req, res){
        res.set({
          'X-Foo': 'bar',
          'X-Bar': 'baz'
        }).end();
      });

      request(app)
      .get('/')
      .end(function(res){
        res.headers.should.have.property('x-foo', 'bar');
        res.headers.should.have.property('x-bar', 'baz');
        done();
      })
    })

    it('should coerce to a string', function(){
      res.headers = {};
      res.set({ ETag: 123 });
      res.get('ETag').should.equal('123');
    })
  })
})
