
var express = require('../')
  , request = require('./support/supertest');

describe('app', function(){
  describe('.response', function(){
    it('should extend the response prototype', function(done){
      var app = express();

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };
      if(app.isHttp2Supported){
        app.http2Response.shout = app.response.shout;
      }

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    })

    it('should not be influenced by other app protos', function(done){
      var app = express()
        , app2 = express();

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };
      if(app.isHttp2Supported){
        app.http2Response.shout = app.response.shout;
      }

      app2.response.shout = function(str){
        this.send(str);
      };
      if(app2.isHttp2Supported){
        app2.http2Response.shout = app2.response.shout;
      }

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    })
  })
})
