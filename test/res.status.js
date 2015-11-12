
var express = require('../')
  , request = require('supertest');

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

    describe('when code is undefined', function () {
      it('should throw a TypeError', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(undefined).send('OK')
        })

        request(app)
        .get('/')
        .expect(500)
        .expect(/TypeError: code argument is required to res.status/)
        .end(done)
      })
    })

    describe('when code is null', function () {
      it('should throw a TypeError', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(null).send('OK')
        })

        request(app)
        .get('/')
        .expect(500)
        .expect(/TypeError: code argument is required to res.status/)
        .end(done)
      })
    })
  })
})
