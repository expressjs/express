
var express = require('../')
  , request = require('./support/http');

describe('req', function(){
  describe('.stale', function(){
    it('should return false when the resource is not modified', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('ETag', '12345');
        res.send(req.stale);
      });

      request(app)
      .get('/')
      .set('If-None-Match', '12345')
      .expect(304, done);
    })

    it('should return true when the resource is modified', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('ETag', '123');
        res.send(req.stale);
      });

      request(app)
      .get('/')
      .set('If-None-Match', '12345')
      .expect('true', done);
    })
  })
})
