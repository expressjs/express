var app = require('../../examples/cookies/app')
  , request = require('../support/http');

describe('cookies', function(){
  describe('GET /', function(){
    it('should have a form', function(done){
      request(app)
        .get('/')
        .expect(/<form/,done)
    })
    it('should respond with no cookies', function(done){
      request(app)
        .get('/')
        .end(function(res){
          res.headers.should.not.have.property('set-cookie')
          done()
        })
    })
  })

  describe('POST /', function(){
    it('should set a cookie', function(done){
      request(app)
        .post('/')
        .set('Content-Type','application/x-www-form-urlencoded')
        .write('remember=1')
        .end(function(res){
          res.headers.should.have.property('set-cookie')
          done()
        })
    })
  })
})