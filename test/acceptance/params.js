var app = require('../../examples/params/app')
  , request = require('../support/http');

describe('params', function(){
  describe('GET /', function(){
    it('should respond with instructions', function(done){
      request(app)
        .get('/')
        .expect(/Visit/,done)
    })
  })

  describe('GET /user/0', function(){
    it('should respond with a user', function(done){
      request(app)
        .get('/user/0')
        .expect(/user tj/,done)
    })
  })

  describe('GET /users/0-2', function(){
    it('should respond with three users', function(done){
      request(app)
        .get('/users/0-2')
        .expect(/users tj, tobi/,done)
    })
  })
})