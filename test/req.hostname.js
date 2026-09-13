'use strict'

var express = require('../')
  , request = require('supertest')

describe('req', function(){
  describe('.hostname', function(){
    it('should return the Host when present', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com')
      .expect('example.com', done);
    })

    it('should strip port number', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com:3000')
      .expect('example.com', done);
    })

    it('should return undefined otherwise', function(done){
      var app = express();

      app.use(function(req, res){
        req.headers.host = null;
        res.end(String(req.hostname));
      });

      request(app)
      .post('/')
      .expect('undefined', done);
    })

    it('should work with IPv6 Host', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]')
      .expect('[::1]', done);
    })

    it('should work with IPv6 Host and port', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]:3000')
      .expect('[::1]', done);
    })

    it('should return undefined for a non-numeric port', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(String(req.hostname));
      });

      request(app)
      .post('/')
      .set('Host', 'example.com:notaport')
      .expect('undefined', done);
    })

    it('should return undefined for an IPv6 Host with a non-numeric port', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(String(req.hostname));
      });

      request(app)
      .post('/')
      .set('Host', '[::1]:notaport')
      .expect('undefined', done);
    })

    describe('with a Host header containing userinfo', function(){
      it('should return the real host, not the userinfo prefix', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .post('/')
        .set('Host', 'evil.com:fake@legitimate.com:3000')
        .expect('legitimate.com', done);
      })

      it('should ignore a userinfo section before the host', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .post('/')
        .set('Host', 'user@example.com')
        .expect('example.com', done);
      })

      it('should strip the port after removing userinfo', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .post('/')
        .set('Host', 'user:pass@example.com:8080')
        .expect('example.com', done);
      })

      it('should remove userinfo from an IPv6 Host', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .post('/')
        .set('Host', 'user@[::1]:8080')
        .expect('[::1]', done);
      })

      it('should use the host after the last "@" when several are present', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .post('/')
        .set('Host', 'a@b@example.com')
        .expect('example.com', done);
      })

      it('should return undefined for an encoded userinfo separator', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(String(req.hostname));
        });

        request(app)
        .post('/')
        .set('Host', 'evil.com:x%40legitimate.com')
        .expect('undefined', done);
      })

      it('should return undefined when there is no host after the userinfo', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(String(req.hostname));
        });

        request(app)
        .post('/')
        .set('Host', 'user@')
        .expect('undefined', done);
      })
    })

    describe('when "trust proxy" is enabled', function(){
      it('should respect X-Forwarded-Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com:3000')
        .expect('example.com', done);
      })

      it('should drop userinfo from a trusted X-Forwarded-Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'evil.com:fake@legitimate.com')
        .expect('legitimate.com', done);
      })

      it('should ignore X-Forwarded-Host if socket addr not trusted', function(done){
        var app = express();

        app.set('trust proxy', '10.0.0.1');

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('localhost', done);
      })

      it('should default to Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('example.com', done);
      })

      describe('when multiple X-Forwarded-Host', function () {
        it('should use the first value', function (done) {
          var app = express()

          app.enable('trust proxy')

          app.use(function (req, res) {
            res.send(req.hostname)
          })

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com, foobar.com')
          .expect(200, 'example.com', done)
        })

        it('should remove OWS around comma', function (done) {
          var app = express()

          app.enable('trust proxy')

          app.use(function (req, res) {
            res.send(req.hostname)
          })

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com , foobar.com')
          .expect(200, 'example.com', done)
        })

        it('should strip port number', function (done) {
          var app = express()

          app.enable('trust proxy')

          app.use(function (req, res) {
            res.send(req.hostname)
          })

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com:8080 , foobar.com:8888')
          .expect(200, 'example.com', done)
        })
      })
    })

    describe('when "trust proxy" is disabled', function(){
      it('should ignore X-Forwarded-Host', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'evil')
        .expect('localhost', done);
      })
    })
  })
})
