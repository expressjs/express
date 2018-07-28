
var express = require('../')
  , request = require('./support/supertest');

describe('app', function(){
  describe('.request', function(){
    it('should extend the request prototype', function(done){
      var app = express();

      app.request.querystring = function(){
        return require('url').parse(this.url).query;
      };
      if(app.isHttp2Supported){
        app.http2Request.querystring = app.request.querystring;
      }

      app.use(function(req, res){
        res.end(req.querystring());
      });

      request(app)
      .get('/foo?name=tobi')
      .expect('name=tobi', done);
    })
  })
})
