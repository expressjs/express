var express = require('../');
var request = require('supertest');

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

  it('should return 405 status on non implemented handlers for specific routes with automatic405 option set', function(done){
    var app = express();

    app.route('/foo', { automatic405: true })
    .get(function (req, res) {
      res.send('get');
    });

    request(app)
    .post('/foo')
    .expect(405, done);
  });

  it('should return 405 for /foo', function (done) {
    var app = express();

    app.get('/bar', function(){});

    app.route('/foo', { automatic405: true })
    .get(function (req, res) {
      res.send('get');
    });

    request(app)
    .post('/foo')
    .expect(405, done);
  });

  it('should return 405 if setting "automatic 405 routing" option', function(done) {
    var app = express();
    app.set('automatic 405 routing', true);

    app.get('/bar', function(){});

    request(app)
    .post('/bar')
    .expect(405, done);

  });

  it('should return 404 if setting "automatic 405 routing" option for a non-defined route', function(done) {
    var app = express();
    app.set('automatic 405 routing', true);

    app.get('/bar', function(){});

    request(app)
    .get('/foo')
    .expect(404, done);

  });

  it('should return 500 if an error is thrown anywhere with 405 routing', function(done) {
    var app = express();
    app.set('automatic 405 routing', true);

    app.use(function(req, res, next){
      next(new Error('boom!'));
    });

    app.get('/bar', function(){});

    request(app)
    .post('/bar')
    .expect(500, done);
  });
});
