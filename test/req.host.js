
var express = require('../')
  , request = require('./support/http');


describe('req', function(){
  describe('.host', function(){
    describe('when X-Forwarded-Host is present', function(){
      describe('when "trust proxy" is enabled', function(){
        it('should return the forwarded header', function (done){
          var app = express();

          app.enable('trust proxy');

          app.use(function (req, res, next){
            res.send(req.host);
          });

          request(app)
          .get('/')
          .set('Host', 'proxy.example.com:80')
          .set('X-Forwarded-Host', 'example.com:80')
          .expect('example.com', done);
        })

        it('should return the forwarded header even if empty', function (done){
          var app = express();

          app.enable('trust proxy');

          app.use(function (req, res, next){
            res.send(req.host);
          });

          request(app)
          .get('/')
          .set('Host', 'proxy.example.com:80')
          .set('X-Forwarded-Host', '')
          .expect('', done);
        })

        it('should return null when there are no headers', function (done){
          var app = express();

          app.enable('trust proxy');

          app.use(function (req, res, next){
            res.send(JSON.stringify(req.host));
          });

          request(app)
          .get('/')
          .unset('Host')
          .expect('null', done);
        })
      })

      describe('when "trust proxy" is disabled', function(){
        it('should return null when there is no Host header', function (done){
          var app = express();

          app.use(function (req, res, next){
            res.send(JSON.stringify(req.host));
          });

          request(app)
          .get('/')
          .set('X-Forwarded-Host', 'example.com:80')
          .unset('Host')
          .expect('null', done);
        })

        it('should return empty string when there is an empty Host header', function (done){
          var app = express();

          app.use(function (req, res, next){
            res.send(req.host);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-Host', 'example.com:80')
          .set('Host', '')
          .expect('', done);
        })

        it('should return the actual host address', function(done){
          var app = express();

          app.use(function(req, res, next){
            res.send(req.host);
          });

          request(app)
          .get('/')
          .set('Host', 'proxy.example.com:80')
          .set('X-Forwarded-Host', 'example.com:80')
          .expect('proxy.example.com', done);
        })
      })
    })

    describe('when X-Forwarded-Host is not present', function (){
      it('should return the domain only', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.send(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com:8080')
        .expect('example.com', done);
      })

      it('should return the domain only even when there is no port', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.send(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('example.com', done);
      })

      it('should return null when there is no Host header', function (done){
        var app = express();

        app.use(function(req, res, next){
          res.send(JSON.stringify(req.host));
        });

        request(app)
        .get('/')
        .unset('Host')
        .expect('null', done);
      })

      it('should return empty string when there is an empty Host header', function (done){
        var app = express();

        app.use(function (req, res, next){
          res.send(req.host);
        });

        request(app)
        .get('/')
        .set('Host', '')
        .expect('', done);
      })
    })
  })
})
