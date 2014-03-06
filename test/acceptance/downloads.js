
var app = require('../../examples/downloads/app')
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
      .end(function(err, res){
        res.status.should.equal(200);
        res.headers.should.have.property('content-disposition', 'attachment; filename="amazing.txt"')
        done()
      })
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