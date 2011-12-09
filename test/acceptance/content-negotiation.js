
var request = require('../support/http')
  , app = require('../../examples/content-negotiation');

describe('content-negotiation', function(){
  describe('GET /users', function(){
    it('should support json', function(done){
      request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .end(function(res){
        res.should.have.header('Content-Type', 'application/json; charset=utf-8');
        res.should.have.status(200);
        res.body.should.equal('[{"name":"tobi"},{"name":"loki"},{"name":"jane"}]');
        done();
      });
    })

    it('should support html', function(done){
      request(app)
      .get('/users')
      .set('Accept', 'text/html')
      .end(function(res){
        res.should.have.header('Content-Type', 'text/html; charset=utf-8');
        res.should.have.status(200);
        res.body.should.equal('<ul><li>tobi</li>\n<li>loki</li>\n<li>jane</li></ul>');
        done();
      });
    })

    it('should support plain text', function(done){
      request(app)
      .get('/users')
      .set('Accept', 'text/plain')
      .end(function(res){
        res.should.have.header('Content-Type', 'text/plain');
        res.should.have.status(200);
        res.body.should.equal('tobi, loki, jane');
        done();
      });
    })

    it('should default to application/json', function(done){
      request(app)
      .get('/users')
      .end(function(res){
        res.should.have.header('Content-Type', 'application/json; charset=utf-8');
        res.should.have.status(200);
        res.body.should.equal('[{"name":"tobi"},{"name":"loki"},{"name":"jane"}]');
        done();
      });
    })
  })
})