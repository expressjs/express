
var request = require('../support/http')
  , app = require('../../examples/content-negotiation');

describe('content-negotiation', function(){
  describe('GET /', function(){
    it('should default to text/html', function(done){
      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('<ul><li>Tobi</li><li>Loki</li><li>Jane</li></ul>');
        done();
      })
    })

    it('should accept to text/plain', function(done){
      request(app)
      .get('/')
      .set('Accept', 'text/plain')
      .end(function(res){
        res.body.should.equal(' - Tobi\n - Loki\n - Jane\n');
        done();
      })
    })
  })
})