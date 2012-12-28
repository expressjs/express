
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.subdomains', function(){
    describe('when present', function(){
      it('should return an array', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', 'tobi.ferrets.example.com')
        .expect('["ferrets","tobi"]', done);
      })
    })

    describe('otherwise', function(){
      it('should return an empty array', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('[]', done);
      })
    })
  })
})
