var app = require('../../examples/helloworld/app')
  , request = require('../support/http');

describe('helloworld', function(){
  describe('GET /', function(){
    it('should respond with "Hello World"', function(done){
      request(app)
        .get('/')
        .expect(/^Hello World$/,done)
    })
  })
})