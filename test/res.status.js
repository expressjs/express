
var express = require('../')
  , request = require('supertest')

describe('res', function(){
  describe('.status(code)', function(){
    it('should set the response .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(201).end('Created');
      });

      request(app)
      .get('/')
      .expect('Created')
      .expect(201, done);
    })

    describe('invalid status codes', function() {

      it('should throw if status code is < 100', function(done) {
        var app = express();
        app.use(function(req, res){
          res.status(99).end();
        });

        request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)

      })

      it('should throw if status code is > 999', function(done) {
        var app = express();
        app.use(function(req, res){
          res.status(1000).end();
        });

        request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)

      })

      it('should throw if status code is undefined', function(done) {
        var app = express();
        app.use(function(req, res){
          res.status(undefined).end();
        });

        request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)

      })

      it('should throw if status code is null', function(done) {
        var app = express();
        app.use(function(req, res){
          res.status(null).end();
        });

        request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)

      })

      it('should throw if status code is a float', function(done) {
        var app = express();
        app.use(function(req, res){
          res.status(200.1).end();
        });

        request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
      })

      it('should throw if status code is a string float', function(done) {
        var app = express();
        app.use(function(req, res){
          res.status('200.1').end();
        });

        request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
      })

      it('should throw if status code is NaN', function(done) {
        var app = express();
        app.use(function(req, res){
          res.status(NaN).end();
        });

        request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
      })
    })
  })
})
