
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

    describe('otherwise', function () {
      it('should return an empty array', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('[]', done);
      })
    })

    describe('when there is no Host header', function () {
      it('should return an empty array', function (done) {
        var app = express();

        app.use(function (req, res, next) {
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .unset('Host')
        .expect([], done);
      })
    })
    describe('when there is an empty Host header', function () {
      it('should return an empty array', function (done) {
        var app = express();

        app.use(function (req, res, next) {
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', '')
        .expect([], done);
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
          .expect('["com","example","sub","ferrets","tobi"]', done);
        })

        describe('when there is no Host header', function () {
          it('should return an empty array', function (done) {
            var app = express();
            app.set('subdomain offset', 0);

            app.use(function (req, res, next) {
              res.send(req.subdomains);
            });

            request(app)
            .get('/')
            .unset('Host')
            .expect([], done);
          })
        })
        describe('when there is an empty Host header', function () {
          it('should return an empty array', function (done) {
            var app = express();
            app.set('subdomain offset', 0);

            app.use(function (req, res, next) {
              res.send(req.subdomains);
            });

            request(app)
            .get('/')
            .set('Host', '')
            .expect([], done);
          })
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
          .expect('["ferrets","tobi"]', done);
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
          .expect('[]', done);
        })
      })
    })
  })
})
