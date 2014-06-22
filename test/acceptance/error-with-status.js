
var app = require('../../examples/error-with-status')
  , request = require('supertest');

describe('error with status', function(){
  describe('204', function(){
    it('should respond with 500', function(done){
      request(app)
        .get('/pass/queryStatus/to/next?status=204')
        .expect(500,done)
    })
  })

  describe('302', function(){
    it('should respond with 500', function(done){
      request(app)
        .get('/pass/queryStatus/to/next?status=302')
        .expect(500,done)
    })
  })
})
