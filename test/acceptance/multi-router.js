var app = require('../../examples/multi-router')
var request = require('supertest')

describe('multi-router', function(){
  describe('GET /',function(){
    it('should respond with root handler', function(done){
      request(app)
      .get('/')
      .expect(200, 'Hello form root route.', done)
    })
  })

  describe('GET /api/v1/',function(){
    it('should respond with APIv1 root handler', function(done){
      request(app)
      .get('/api/v1/')
      .expect(200, 'Hello from APIv1 root route.', done)
    })
  })

  describe('GET /api/v1/users',function(){
    it('should respond with users from APIv1', function(done){
      request(app)
      .get('/api/v1/users')
      .expect(200, 'List of APIv1 users.', done)
    })
  })

  describe('GET /api/v2/',function(){
    it('should respond with APIv2 root handler', function(done){
      request(app)
      .get('/api/v2/')
      .expect(200, 'Hello from APIv2 root route.', done)
    })
  })

  describe('GET /api/v2/users',function(){
    it('should respond with users from APIv2', function(done){
      request(app)
      .get('/api/v2/users')
      .expect(200, 'List of APIv2 users.', done)
    })
  })
})
