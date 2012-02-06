
var express = require('../')
  , request = require('./support/http');

describe('app.all()', function(){
  it('should add a router per method', function(done){
    var app = express();

    app.all('/tobi', function(req, res){
      res.end(req.method);
    });

    request(app)
    .put('/tobi')
    .expect('PUT', function(){
      request(app)
      .get('/tobi')
      .expect('GET', done);
    });
  })
})
