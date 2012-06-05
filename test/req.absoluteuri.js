var express = require('../')
, request = require('./support/http');

describe('req', function(){
  describe('.buildAbsoluteUri', function(){
    it('should return the entire uri string', function(){
      var app = express();
      
      app.use(function(req,res){
        res.end(req.buildAbsoluteUri("express.com"));
      })

      request(app)
        .get('/absuri')
        .end(function(res){
          res.body.should.equal('http://express.com/absuri');

        })

      app.use(function(req,res){
        res.end(req.buildAbsoluteUri());
      })

      request(app)
        .get('/absuri')
        .end(function(res){
          res.body.should.match(/(|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)
        })

    })
  })

})
