
var express = require('../')
  , request = require('supertest')
  , assert = require('assert')
  , http = require("http");

describe('res', function(){
  describe('.sendStatus(statusCode)', function(){
    it('should send the correct status', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendStatus(201);
      });

      request(app)
      .get('/')
      .expect(201, done);
    })
    
    it('should send a body from http\'s STATUS_CODE', function(done){
      var app = express();

      app.use(function(req, res){
        res.sendStatus(404);
      });

      request(app)
      .get('/')
      .expect(404, http.STATUS_CODES[404], done);
    })
  })
})
