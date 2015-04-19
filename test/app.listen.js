
var express = require('../')
  , assert = require('assert')
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

  it('should callback on HTTP server errors', function(done){
    var app = express();
    var app2 = express();

    var server = app.listen(9999, function(err){
      assert(err === undefined);
      app2.listen(9999, function(err){
        assert(err.code === 'EADDRINUSE');
        server.close();
        done();
      });
    });
  })
})
