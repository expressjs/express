
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.send(code)', function(){
    it('should set .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(201);
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
