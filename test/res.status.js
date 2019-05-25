
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.status(code)', function(){
    it('should set the response .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(201).end('Created');
      });

      request(app)
      .get('/')
      .expect('Created')
      .expect(201, done);
    })
  })
})
