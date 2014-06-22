
var app = require('../../examples/error-with-status-code')
  , request = require('supertest');

describe('error-with-status-code', function(){
  describe('GET /next/with/status/code', function(){
    it('should handle 204 and no content', function(done){
      request(app)
        .get('/next/with/status/204')
        .expect(204, '', done)
    })
  })
})
