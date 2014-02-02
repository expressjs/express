
var express = require('../')
  , request = require('./support/http')
  , assert = require('assert');

describe('req', function(){
  describe('.port', function(){

    it('should return the port number when present', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com:3000')
      .expect('3000', done);
    })

    it('should return undefined when omitted', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com')
      .expect('undefined', done);
    })

    it('should return undefined otherwise', function(done){
      var app = express();

      app.use(function(req, res){
        req.headers.host = null;
        res.end(String(req.host));
      });

      request(app)
      .post('/')
      .expect('undefined', done);
    })

  })
})
