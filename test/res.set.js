
var express = require('../')
  , request = require('supertest')
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
      .expect('Content-Type', 'text/x-foo')
      .end(done);
    })

    it('should coerce to a string', function(){
      res.headers = {};
      res.set('X-Number', 123);
      res.get('X-Number').should.equal('123');
    })
  })

  describe('.set(field, values)', function(){
    it('should set multiple response header fields', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Set-Cookie', ["type=ninja", "language=javascript"]);
        res.send(res.get('Set-Cookie'));
      });

      request(app)
      .get('/')
      .expect('["type=ninja","language=javascript"]', done);
    })

    it('should coerce to an array of strings', function(){
      res.headers = {};
      res.set('X-Numbers', [123, 456]);
      JSON.stringify(res.get('X-Numbers'))
      .should.equal('["123","456"]');
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
      .expect('X-Foo', 'bar')
      .expect('X-Bar', 'baz')
      .end(done);
    })

    it('should coerce to a string', function(){
      res.headers = {};
      res.set({ 'X-Number': 123 });
      res.get('X-Number').should.equal('123');
    })
  })
})
