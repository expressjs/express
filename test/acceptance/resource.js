var app = require('../../examples/resource/app')
  , request = require('../support/http');

describe('resource', function(){
  describe('GET /', function(){
    it('should respond with instructions', function(done){
      request(app)
        .get('/')
        .expect(/^<h1>Examples:<\/h1>/,done)
    })
  })

  describe('GET /users', function(){
    it('should respond with all users', function(done){
      request(app)
        .get('/users')
        .expect(/^\[{"name":"tj"},{"name":"ciaran"},{"name":"aaron"},{"name":"guillermo"},{"name":"simon"},{"name":"tobi"}\]/,done)
    })
  })

  describe('GET /users/1', function(){
    it('should respond with user 1', function(done){
      request(app)
        .get('/users/1')
        .expect(/^{"name":"ciaran"}/,done)
    })
  })

  describe('GET /users/1..3', function(){
    it('should respond with users 1 through 3', function(done){
      request(app)
        .get('/users/1..3')
        .expect(/^<ul><li>ciaran<\/li>\n<li>aaron<\/li>\n<li>guillermo<\/li><\/ul>/,done)
    })
  })

  describe('DELETE /users/1', function(){
    it('should respond with users 1 through 3', function(done){
      request(app)
        .delete('/users/1')
        .expect(/^destroyed/,done)
    })
  })

  describe('GET /users/1..3.json', function(){
    it('should respond with users 2 and 3 as json', function(done){
      request(app)
        .get('/users/1..3.json')
        .expect(/^\[null,{"name":"aaron"},{"name":"guillermo"}\]/,done)
    })
  })
})
// curl http://localhost:3000/users     -- responds with all users
// curl http://localhost:3000/users/1   -- responds with user 1
// curl http://localhost:3000/users/4   -- responds with error
// curl http://localhost:3000/users/1..3 -- responds with several users
// curl -X DELETE http://localhost:3000/users/1  -- deletes the user

    // , '<li>GET /users</li>'
    // , '<li>GET /users/1</li>'
    // , '<li>GET /users/3</li>'
    // , '<li>GET /users/1..3</li>'
    // , '<li>GET /users/1..3.json</li>'
    // , '<li>DELETE /users/4</li>'