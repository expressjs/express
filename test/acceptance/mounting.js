var app = require('../../examples/mounting/app')
  , request = require('../support/http');

describe('mounting', function(){
  describe('GET /', function(){
    it('should respond with blog link', function(done){
      request(app)
        .get('/')
        .expect(/href="\/blog"/,done)
    })
  })

  describe('GET /blog', function(){
    it('should contain a link as /blog/post/', function(done){
      request(app)
        .get('/blog')
        .expect(/href="\/blog\/post\//,done)
    })
  })
})