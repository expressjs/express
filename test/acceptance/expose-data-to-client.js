
var app = require('../../examples/expose-data-to-client')
  , request = require('supertest');

describe('expose-data-to-client', function(){
  describe('GET /',function(){
    it('should redirect to /user', function(done){
      request(app)
        .get('/')
        .expect('Location', '/user')
        .expect(302, done)
    })
  })

  describe('GET /user', function(){
    it('should display the exposed data', function(done){
      request(app)
        .get('/user')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/{"user":{"id":123,"name":"Tobi"}/)
        .expect(200, done)
    })
  })
})
