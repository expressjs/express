
var express = require('../')
  , request = require('supertest');

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
        .expect(200, ['ferrets', 'tobi'], done);
      })

      it('should work with IPv4 address', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', '127.0.0.1')
        .expect(200, [], done);
      })

      it('should work with IPv6 address', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', '[::1]')
        .expect(200, [], done);
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
        .expect(200, [], done);
      })
    })

    describe('with no host', function(){
      it('should return an empty array', function(done){
        var app = express();

        app.use(function(req, res){
          req.headers.host = null;
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .expect(200, [], done);
      })
    })

    describe('with trusted X-Forwarded-Host', function () {
      it('should return an array', function (done) {
        var app = express();

        app.set('trust proxy', true);
        app.use(function (req, res) {
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Host', 'tobi.ferrets.example.com')
        .expect(200, ['ferrets', 'tobi'], done);
      })
    })

    describe('when subdomain offset is set', function(){
      describe('when subdomain offset is zero', function(){
        it('should return an array with the whole domain', function(done){
          var app = express();
          app.set('subdomain offset', 0);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', 'tobi.ferrets.sub.example.com')
          .expect(200, ['com', 'example', 'sub', 'ferrets', 'tobi'], done);
        })

        it('should return an array with the whole IPv4', function (done) {
          var app = express();
          app.set('subdomain offset', 0);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', '127.0.0.1')
          .expect(200, ['127.0.0.1'], done);
        })

        it('should return an array with the whole IPv6', function (done) {
          var app = express();
          app.set('subdomain offset', 0);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', '[::1]')
          .expect(200, ['[::1]'], done);
        })
      })

      describe('when present', function(){
        it('should return an array', function(done){
          var app = express();
          app.set('subdomain offset', 3);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', 'tobi.ferrets.sub.example.com')
          .expect(200, ['ferrets', 'tobi'], done);
        })
      })

      describe('otherwise', function(){
        it('should return an empty array', function(done){
          var app = express();
          app.set('subdomain offset', 3);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', 'sub.example.com')
          .expect(200, [], done);
        })
      })
    })
  })
})
