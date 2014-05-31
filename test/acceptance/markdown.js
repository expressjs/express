
var app = require('../../examples/markdown')
var request = require('supertest')

describe('markdown', function(){
  describe('GET /', function(){
    it('should respond with html', function(done){
      request(app)
        .get('/')
        .expect(/<h1[^>]*>Markdown Example<\/h1>/,done)
    })
  })

  describe('GET /fail',function(){
    it('should respond with an error', function(done){
      request(app)
        .get('/fail')
        .expect(500,done)
    })
  })
})
