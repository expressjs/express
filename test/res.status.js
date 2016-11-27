
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

    it('should throw a TypeError if not a number', function(done) {
      var app = express();

      app.use(function(req, res){
        res.status('foo').end();
      });

      request(app)
      .get('/')
      .expect(500, /Invalid status code/, done);
    })

    it('should throw a TypeError if invalid number', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(10000).end();
      });

      request(app)
      .get('/')
      .expect(500, /Invalid status code/, done);
    })
  })
})
