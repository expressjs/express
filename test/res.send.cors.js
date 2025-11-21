'use strict'

var assert = require('node:assert')
var express = require('..');
var request = require('supertest');

describe('res.send() with CORS-aware ETags', function(){
  describe('when etag is set to weak-cors', function(){
    it('should generate CORS-aware ETag when CORS header is present', function(done){
      var app = express();
      app.set('etag', 'weak-cors');

      app.use(function(req, res){
        res.set('Access-Control-Allow-Origin', 'https://example.com');
        res.send('hello');
      });

      request(app)
        .get('/')
        .expect('ETag', /^W\/".+"$/)
        .expect(200, 'hello', done);
    });

    it('should generate different ETags for different origins', function(done){
      var app = express();
      app.set('etag', 'weak-cors');
      var etag1, etag2;

      app.use(function(req, res){
        var origin = req.get('Origin') || 'https://default.com';
        res.set('Access-Control-Allow-Origin', origin);
        res.send('same body');
      });

      request(app)
        .get('/')
        .set('Origin', 'https://a.com')
        .expect(200)
        .end(function(err, res1){
          if (err) return done(err);
          etag1 = res1.headers.etag;
          assert.ok(etag1, 'ETag should be present');

          request(app)
            .get('/')
            .set('Origin', 'https://b.com')
            .expect(200)
            .end(function(err, res2){
              if (err) return done(err);
              etag2 = res2.headers.etag;
              assert.ok(etag2, 'ETag should be present');
              assert.notStrictEqual(etag1, etag2, 'ETags should differ for different origins');
              done();
            });
        });
    });

    it('should return 304 for same origin with matching ETag', function(done){
      var app = express();
      app.set('etag', 'weak-cors');

      app.use(function(req, res){
        res.set('Access-Control-Allow-Origin', 'https://example.com');
        res.send('content');
      });

      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          var etag = res.headers.etag;
          assert.ok(etag, 'ETag should be present');

          request(app)
            .get('/')
            .set('If-None-Match', etag)
            .expect(304, done);
        });
    });

    it('should return 200 for different origin with matching body-only ETag', function(done){
      var app = express();
      app.set('etag', 'weak-cors');
      var etagOriginA;

      app.use(function(req, res){
        var origin = req.get('Origin') || 'https://a.com';
        res.set('Access-Control-Allow-Origin', origin);
        res.send('content');
      });

      // First request from origin A
      request(app)
        .get('/')
        .set('Origin', 'https://a.com')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          etagOriginA = res.headers.etag;
          assert.ok(etagOriginA, 'ETag should be present');

          // Second request from origin B with origin A's ETag
          request(app)
            .get('/')
            .set('Origin', 'https://b.com')
            .set('If-None-Match', etagOriginA)
            .expect(200, done);  // Should NOT be 304
        });
    });

    it('should work without CORS headers (fallback to body-only)', function(done){
      var app = express();
      app.set('etag', 'weak-cors');

      app.use(function(req, res){
        res.send('hello');
      });

      request(app)
        .get('/')
        .expect('ETag', /^W\/".+"$/)
        .expect(200, 'hello', done);
    });

    it('should generate same ETag for same origin', function(done){
      var app = express();
      app.set('etag', 'weak-cors');

      app.use(function(req, res){
        res.set('Access-Control-Allow-Origin', 'https://example.com');
        res.send('content');
      });

      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res1){
          if (err) return done(err);
          var etag1 = res1.headers.etag;

          request(app)
            .get('/')
            .expect(200)
            .end(function(err, res2){
              if (err) return done(err);
              var etag2 = res2.headers.etag;
              assert.strictEqual(etag1, etag2, 'ETags should be the same for same origin');
              done();
            });
        });
    });
  });

  describe('when etag is set to strong-cors', function(){
    it('should generate strong CORS-aware ETag', function(done){
      var app = express();
      app.set('etag', 'strong-cors');

      app.use(function(req, res){
        res.set('Access-Control-Allow-Origin', 'https://example.com');
        res.send('hello');
      });

      request(app)
        .get('/')
        .expect(function(res){
          var etag = res.headers.etag;
          assert.ok(etag, 'ETag should be present');
          assert.ok(!etag.startsWith('W/'), 'ETag should be strong (no W/ prefix)');
        })
        .expect(200, 'hello', done);
    });

    it('should generate different strong ETags for different origins', function(done){
      var app = express();
      app.set('etag', 'strong-cors');

      app.use(function(req, res){
        var origin = req.get('Origin') || 'https://default.com';
        res.set('Access-Control-Allow-Origin', origin);
        res.send('body');
      });

      request(app)
        .get('/')
        .set('Origin', 'https://x.com')
        .expect(200)
        .end(function(err, res1){
          if (err) return done(err);
          var etag1 = res1.headers.etag;

          request(app)
            .get('/')
            .set('Origin', 'https://y.com')
            .expect(200)
            .end(function(err, res2){
              if (err) return done(err);
              var etag2 = res2.headers.etag;
              assert.notStrictEqual(etag1, etag2);
              assert.ok(!etag1.startsWith('W/'), 'ETag1 should be strong');
              assert.ok(!etag2.startsWith('W/'), 'ETag2 should be strong');
              done();
            });
        });
    });
  });

  describe('backward compatibility', function(){
    it('should not change behavior when etag is set to weak', function(done){
      var app = express();
      app.set('etag', 'weak');

      app.use(function(req, res){
        res.set('Access-Control-Allow-Origin', 'https://example.com');
        res.send('hello');
      });

      // With default weak mode, same body should have same ETag regardless of CORS headers
      request(app)
        .get('/')
        .set('Origin', 'https://a.com')
        .expect(200)
        .end(function(err, res1){
          if (err) return done(err);
          var etag1 = res1.headers.etag;

          request(app)
            .get('/')
            .set('Origin', 'https://b.com')
            .expect(200)
            .end(function(err, res2){
              if (err) return done(err);
              var etag2 = res2.headers.etag;
              // In non-CORS mode, ETags should be the same (body-only)
              assert.strictEqual(etag1, etag2, 'ETags should be same in backward compatible mode');
              done();
            });
        });
    });

    it('should support JSON responses with CORS-aware ETags', function(done){
      var app = express();
      app.set('etag', 'weak-cors');

      app.use(function(req, res){
        res.set('Access-Control-Allow-Origin', 'https://example.com');
        res.json({ message: 'hello' });
      });

      request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect('ETag', /^W\/".+"$/)
        .expect(200, done);
    });
  });
});
