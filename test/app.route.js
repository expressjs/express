var express = require('../');
var request = require('supertest');

var describePromises = global.Promise ? describe : describe.skip

describe('app.route', function(){
  it('should return a new route', function(done){
    var app = express();

    app.route('/foo')
    .get(function(req, res) {
      res.send('get');
    })
    .post(function(req, res) {
      res.send('post');
    });

    request(app)
    .post('/foo')
    .expect('post', done);
  });

  it('should all .VERB after .all', function(done){
    var app = express();

    app.route('/foo')
    .all(function(req, res, next) {
      next();
    })
    .get(function(req, res) {
      res.send('get');
    })
    .post(function(req, res) {
      res.send('post');
    });

    request(app)
    .post('/foo')
    .expect('post', done);
  });

  it('should support dynamic routes', function(done){
    var app = express();

    app.route('/:foo')
    .get(function(req, res) {
      res.send(req.params.foo);
    });

    request(app)
    .get('/test')
    .expect('test', done);
  });

  it('should not error on empty routes', function(done){
    var app = express();

    app.route('/:foo');

    request(app)
    .get('/test')
    .expect(404, done);
  });

  describePromises('promise support', function () {
    it('should pass rejected promise value', function (done) {
      var app = express()
      var route = app.route('/foo')

      route.all(function createError (req, res, next) {
        return Promise.reject(new Error('boom!'))
      })

      route.all(function helloWorld (req, res) {
        res.send('hello, world!')
      })

      route.all(function handleError (err, req, res, next) {
        res.status(500)
        res.send('caught: ' + err.message)
      })

      request(app)
      .get('/foo')
      .expect(500, 'caught: boom!', done)
    })

    it('should pass rejected promise without value', function (done) {
      var app = express()
      var route = app.route('/foo')

      route.all(function createError (req, res, next) {
        return Promise.reject()
      })

      route.all(function helloWorld (req, res) {
        res.send('hello, world!')
      })

      route.all(function handleError (err, req, res, next) {
        res.status(500)
        res.send('caught: ' + err.message)
      })

      request(app)
      .get('/foo')
      .expect(500, 'caught: Rejected promise', done)
    })

    it('should ignore resolved promise', function (done) {
      var app = express()
      var route = app.route('/foo')

      route.all(function createError (req, res, next) {
        res.send('saw GET /foo')
        return Promise.resolve('foo')
      })

      route.all(function () {
        done(new Error('Unexpected route invoke'))
      })

      request(app)
      .get('/foo')
      .expect(200, 'saw GET /foo', done)
    })

    describe('error handling', function () {
      it('should pass rejected promise value', function (done) {
        var app = express()
        var route = app.route('/foo')

        route.all(function createError (req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        route.all(function handleError (err, req, res, next) {
          return Promise.reject(new Error('caught: ' + err.message))
        })

        route.all(function handleError (err, req, res, next) {
          res.status(500)
          res.send('caught again: ' + err.message)
        })

        request(app)
        .get('/foo')
        .expect(500, 'caught again: caught: boom!', done)
      })

      it('should pass rejected promise without value', function (done) {
        var app = express()
        var route = app.route('/foo')

        route.all(function createError (req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        route.all(function handleError (err, req, res, next) {
          return Promise.reject()
        })

        route.all(function handleError (err, req, res, next) {
          res.status(500)
          res.send('caught again: ' + err.message)
        })

        request(app)
        .get('/foo')
        .expect(500, 'caught again: Rejected promise', done)
      })

      it('should ignore resolved promise', function (done) {
        var app = express()
        var route = app.route('/foo')

        route.all(function createError (req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        route.all(function handleError (err, req, res, next) {
          res.status(500)
          res.send('caught: ' + err.message)
          return Promise.resolve('foo')
        })

        route.all(function () {
          done(new Error('Unexpected route invoke'))
        })

        request(app)
        .get('/foo')
        .expect(500, 'caught: boom!', done)
      })
    })
  })
});
