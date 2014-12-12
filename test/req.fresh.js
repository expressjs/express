
var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.fresh', function(){
    it('should return true when the resource is not modified', function(done){
      var app = express();
      var etag = '"12345"';

      app.use(function(req, res){
        res.set('ETag', etag);
        res.send(req.fresh);
      });

      request(app)
      .get('/')
      .set('If-None-Match', etag)
      .expect(304, done);
    })

    it('should return false when the resource is modified', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('ETag', '"123"');
        res.send(req.fresh);
      });

      request(app)
      .get('/')
      .set('If-None-Match', '"12345"')
      .expect(200, 'false', done);
    })

    it('should succeed even if no response headers are present', function(done){
      var app = express();
      app.disable('x-powered-by'); // ensure there are no default response headers

      app.use(function(req, res){
        res.send(req.fresh);
      });

      // this would previously fail because jshttp/fresh is expecting res.headers to not be undefined
      request(app)
      .get('/')
      .expect(200, done);
    })
  })
})
