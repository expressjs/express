
var app = require('../../examples/downloads')
  , request = require('supertest');

describe('downloads', function(){
  describe('GET /', function(){
    it('should have a link to amazing.txt', function(done){
      request(app)
      .get('/')
      .expect(/href="\/files\/amazing.txt"/, done)
    })
  })

  describe('GET /files/amazing.txt', function(){
    it('should have a download header', function(done){
      request(app)
      .get('/files/amazing.txt')
      .expect('Content-Disposition', 'attachment; filename="amazing.txt"')
      .expect(200, done)
    })
  })

  describe('GET /files/missing.txt', function(){
    it('should respond with 404', function(done){
      request(app)
      .get('/files/missing.txt')
      .expect(404, done)
    })
  })
})
