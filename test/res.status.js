
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

    it('should throw a TypeError if code is undefined', function(done){
      var app = express();
      app.use(function(req, res){
        res.status(undefined).end('Created');
      });

      request(app)
      .get('/')
      .expect(invalidCode)
      .expect(500, done);
    })

    it('should throw a TypeError if code is null', function(done){
      var app = express();
      app.use(function(req, res){
        res.status(null).end('Created');
      });

      request(app)
      .get('/')
      .expect(invalidCode)
      .expect(500, done);
    })

  })
})

function invalidCode(res) {
  if (!(res.error.text.match(/TypeError/ && res.error.text.match(/status code/)))) {
    throw new Error('Expected a TypeError for invalid status code.');
  }
}

