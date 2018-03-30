
var express = require('../')
  , request = require('supertest');

describe('app.all()', function(){
  it('should add a router per method', function(done){
    var app = express();

    app.all('/tobi', function(req, res){
      res.end(req.method);
    });

    request(app)
    .put('/tobi')
    .expect('PUT', function(){
      request(app)
      .get('/tobi')
      .expect('GET', done);
    });
  })

  it('should run the callback for a method just once', function(done){
    var app = express()
      , n = 0;

    app.all('/*', function(req, res, next){
      if (n++) return done(new Error('DELETE called several times'));
      next();
    });

    request(app)
    .del('/tobi')
    .expect(404, done);
  })

  it('should resolve the promise correctly and return 200', function(done){
    var app = express();

    app.all('/*', function(req, res, next){
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
          res.end(req.method);
        }, 200);
      });
    });

    request(app)
    .get('/tobi')
    .expect(200, done);
  });

  it('should catch the promise error and return 500', function(done){
    var app = express();

    app.all('/*', function (req, res, next){
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(new Error('async request failed'));
        }, 200);
      });
    });

    app.use(function (err, req, res, next) {
      res.sendStatus(500)
    });

    request(app)
    .get('/tobi')
    .expect(500, done);
  });
})
