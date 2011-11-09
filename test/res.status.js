
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.status(code)', function(){
    it('should set the response .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(201).end('Created');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('Created');
        res.statusCode.should.equal(201);
        done();
      })
    })
  })
})
