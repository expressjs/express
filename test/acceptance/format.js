var app = require('../../examples/format/app')
  , request = require('../support/http');

describe('format', function(){
  describe('GET /', function(){
    it('should respond with 200', function(done){
      request(app)
        .get('/')
        .expect(200,done)
    })
  })

  describe('GET /item/2', function(){
    it('should respond with html', function(done){
      request(app)
        .get('/item/2')
        .end(function(res){
          res.should.have.property('statusCode',200)
          res.should.have.property('body','<h1>baz</h1>')
          res.headers.should.have.property('content-type','text/html; charset=utf-8')
          done()
        })
    })
  })

  describe('GET /item/2.json', function(){
    it('should respond with json', function(done){
      request(app)
        .get('/item/2.json')
        .end(function(res){
          res.should.have.property('statusCode',200)
          res.should.have.property('body','{"name":"baz"}')
          res.headers.should.have.property('content-type','application/json; charset=utf-8')
          done()
        })
    })
  })

  describe('GET /item/2.xml', function(){
    it('should respond with xml', function(done){
      request(app)
        .get('/item/2.xml')
        .end(function(res){
          res.should.have.property('statusCode',200)
          res.should.have.property('body','<items><item>baz</item></items>')
          res.headers.should.have.property('content-type','application/xml')
          done()
        })
    })
  })

})