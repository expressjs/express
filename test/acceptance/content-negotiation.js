
var request = require('../support/http')
  , app = require('../../examples/content-negotiation');

describe('content-negotiation', function(){
  describe('GET /', function(){
    it('should default to text/html', function(done){
      request(app)
      .get('/')
      .expect('<ul><li>Tobi</li><li>Loki</li><li>Jane</li></ul>')
      .end(done);
    })

    it('should accept to text/plain', function(done){
      request(app)
      .get('/')
      .set('Accept', 'text/plain')
      .expect(' - Tobi\n - Loki\n - Jane\n')
      .end(done);
    })
  })
})