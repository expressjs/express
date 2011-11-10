
var express = require('../')
  , request = require('./support/http');

describe('app', function(){
  describe('.response', function(){
    it('should extend the response prototype', function(done){
      var app = express();

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('HEY');
        done();
      });
    })
  })
})
