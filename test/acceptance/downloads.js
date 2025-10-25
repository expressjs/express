
var app = require('../../examples/downloads')
  , request = require('supertest')
  , http = require('node:http')
  , assert = require('node:assert');

describe('downloads', function(){
  describe('GET /', function(){
    it('should have a link to amazing.txt', function(done){
      request(app)
      .get('/')
      .expect(/href="\/files\/amazing.txt"/, done)
    })
  })

  describe('GET /files/notes/groceries.txt', function () {
    it('should have a download header', function (done) {
      request(app)
        .get('/files/notes/groceries.txt')
        .expect('Content-Disposition', 'attachment; filename="groceries.txt"')
        .expect(200, done)
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

  describe('GET /files/../index.js', function () {
    it('should respond with 403', function (done) {
      var server = app.listen(function () {
        var port = server.address().port
        // Use http.request to avoid URL normalization by superagent
        var req = http.request({
          hostname: 'localhost',
          port: port,
          path: '/files/../index.js',
          method: 'GET'
        }, function (res) {
          assert.strictEqual(res.statusCode, 403)
          server.close(done)
        })
        req.on('error', done)
        req.end()
      })
    })
  })
})
