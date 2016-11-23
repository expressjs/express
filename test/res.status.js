
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

    it('should throw a TypeError if invalid', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(10000).end();
      });

      request(app)
      .get('/')
      .expect(500, /Invalid status code/, done);
    })

    it('should handle numeric strings', function(done) {
      var app = express();

      app.use(function(req, res){
        res.status('400').end();
      });

      request(app)
      .get('/')
      .expect(400, done);
    })

    it('should handle floats as integers', function(done) {
      var app = express();

      app.use(function(req, res){
        res.status(404.04).end();
      });

      request(app)
      .get('/')
      .expect(404, done);
    })
  })
})
