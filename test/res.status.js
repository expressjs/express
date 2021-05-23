
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
    it("should throw an error internal server error for invalid status code.", function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(209).end();
      });

      request(app).get("/").expect(500, done);
    });
  })
})
