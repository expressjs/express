
var express = require('../')
  , request = require('./support/http')
  , assert = require('assert');

describe('req', function(){
  describe('.host', function(){
    it('should return the Host when present', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com')
      .expect('example.com', done);
    })
  })
})
