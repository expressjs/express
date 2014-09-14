
var express = require('../')
  , request = require('supertest');

describe('app.listen()', function(){
  it('should wrap with an HTTP server', function(done){
    var app = express();

    app.del('/tobi', function(req, res){
      res.end('deleted tobi!');
    });

    var server = app.listen(9999, function(){
      server.close();
      done();
    });
  })
})
