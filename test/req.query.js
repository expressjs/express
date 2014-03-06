
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.query', function(){
    it('should default to {}', function(done){
      var app = express();

      app.use(function(req, res){
        req.query.should.eql({});
        res.end();
      });

      request(app)
      .get('/')
      .end(function(res){
        done();
      });
    })

    it('should contain the parsed query-string', function(done){
      var app = express();

      app.use(function(req, res){
        req.query.should.eql({ user: { name: 'tj' }});
        res.end();
      });

      request(app)
      .get('/?user[name]=tj')
      .end(function(res){
        done();
      });
    })
  })
})
