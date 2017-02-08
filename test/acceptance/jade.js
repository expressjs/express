
var app = require('../../examples/jade')
  , request = require('supertest');

describe('jade', function(){
  describe('GET /', function(){
    it('should respond with html', function(done){
      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<div class="email">tj@vision-media.ca<\/div>/)
      .expect(/<div class="email">ciaranj@gmail\.com<\/div>/)
      .expect(/<div class="email">aaron\.heckmann\+github@gmail\.com<\/div>/)
      .expect(200, done)
    })
  })
})
