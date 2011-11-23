
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.accepts(type)', function(){
    it('should return true when Accept is not present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .expect('yes', done);
    })
    
    it('should return true when present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('yes', done);
    })
    
    it('should return false otherwise', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('no', done);
    })
  })
})
