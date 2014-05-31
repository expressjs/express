
var request = require('supertest')
  , app = require('../../examples/ejs');

describe('ejs', function(){
  describe('GET /', function(){
    it('should respond with html', function(done){
      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<li>tobi &lt;tobi@learnboost\.com&gt;<\/li>/)
      .expect(/<li>loki &lt;loki@learnboost\.com&gt;<\/li>/)
      .expect(/<li>jane &lt;jane@learnboost\.com&gt;<\/li>/)
      .expect(200, done)
    })
  })
})
