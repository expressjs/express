'use strict'

var express = require('../')
  , request = require('supertest');
var shouldSkipQuery = require('./support/utils').shouldSkipQuery

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

    it('should return false without response headers', function(done){
      var app = express();

      app.disable('x-powered-by')
      app.use(function(req, res){
        res.send(req.fresh);
      });

      request(app)
      .get('/')
      .expect(200, 'false', done);
    })

    it('should return true for a QUERY request with a body when the resource is not modified', function(done){
      if (shouldSkipQuery(process.versions.node)) {
        this.skip()
      }
      var app = express();
      var etag = '"12345"';

      app.use(function(req, res){
        res.set('ETag', etag);
        res.send(req.fresh);
      });

      request(app)
      .query('/')
      .set('If-None-Match', etag)
      .send({ ids: ['a', 'b'] })
      .expect(304, done);
    })

    it('should return false for a QUERY request with a body when the resource is modified', function(done){
      if (shouldSkipQuery(process.versions.node)) {
        this.skip()
      }
      var app = express();

      app.use(function(req, res){
        res.set('ETag', '"123"');
        res.send(req.fresh);
      });

      request(app)
      .query('/')
      .set('If-None-Match', '"12345"')
      .send({ ids: ['a', 'b'] })
      .expect(200, 'false', done);
    })
  })
})
