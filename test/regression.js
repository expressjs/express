
var express = require('../')
  , request = require('./support/http');

describe('throw after .end()', function(){
  it('should fail gracefully', function(done){
    var app = express();

    app.get('/', function(req, res){
      res.end('yay');
      throw new Error('boom');
    });

    request(app)
    .get('/')
    .end(function(res){
      res.should.have.status(200);
      res.body.should.equal('yay');
      done();
    });
  })
})
