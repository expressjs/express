
var after = require('after');
var express = require('../')
  , request = require('supertest')
  , assert = require('assert');
var onFinished = require('on-finished');
var path = require('path');
var should = require('should');
var fixtures = path.join(__dirname, 'fixtures');

describe('res', function(){
  describe('.sendFile(path)', function () {
    it('should error missing path', function (done) {
      var app = createApp();

      request(app)
      .get('/')
      .expect(500, /path.*required/, done);
    });

    it('should transfer a file', function (done) {
      var app = createApp(path.resolve(fixtures, 'name.txt'));

      request(app)
      .get('/')
      .expect(200, 'tobi', done);
    });

    it('should transfer a file with special characters in string', function (done) {
      var app = createApp(path.resolve(fixtures, '% of dogs.txt'));

      request(app)
      .get('/')
      .expect(200, '20%', done);
    });

    it('should 404 for directory', function (done) {
      var app = createApp(path.resolve(fixtures, 'blog'));

      request(app)
      .get('/')
      .expect(404, done);
    });

    it('should 404 when not found', function (done) {
      var app = createApp(path.resolve(fixtures, 'does-no-exist'));

      app.use(function (req, res) {
        res.statusCode = 200;
        res.send('no!');
      });

      request(app)
      .get('/')
      .expect(404, done);
    });

    it('should not override manual content-types', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.contentType('application/x-bogus');
        res.sendFile(path.resolve(fixtures, 'name.txt'));
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/x-bogus')
      .end(done);
    })

    describe('with "dotfiles" option', function () {
      it('should not serve dotfiles by default', function (done) {
        var app = createApp(path.resolve(__dirname, 'fixtures/.name'));

        request(app)
        .get('/')
        .expect(404, done);
      });

      it('should accept dotfiles option', function(done){
        var app = createApp(path.resolve(__dirname, 'fixtures/.name'), { dotfiles: 'allow' });

        request(app)
        .get('/')
        .expect(200, 'tobi', done);
      });
    });

    describe('with "headers" option', function () {
      it('should accept headers option', function (done) {
        var headers = {
           'x-success': 'sent',
           'x-other': 'done'
        };
        var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), { headers: headers });

        request(app)
        .get('/')
        .expect('x-success', 'sent')
        .expect('x-other', 'done')
        .expect(200, done);
      });

      it('should ignore headers option on 404', function (done) {
        var headers = { 'x-success': 'sent' };
        var app = createApp(path.resolve(__dirname, 'fixtures/does-not-exist'), { headers: headers });

        request(app)
        .get('/')
        .expect(404, function (err, res) {
          if (err) return done(err);
          res.headers.should.not.have.property('x-success');
          done();
        });
      });
    });

    describe('with "root" option', function () {
      it('should not transfer relative with without', function (done) {
        var app = createApp('test/fixtures/name.txt');

        request(app)
        .get('/')
        .expect(500, /must be absolute/, done);
      })

      it('should serve relative to "root"', function (done) {
        var app = createApp('name.txt', {root: fixtures});

        request(app)
        .get('/')
        .expect(200, 'tobi', done);
      })

      it('should disallow requesting out of "root"', function (done) {
        var app = createApp('foo/../../user.html', {root: fixtures});

        request(app)
        .get('/')
        .expect(403, done);
      })
    })
  })

  describe('.sendFile(path, fn)', function () {
    it('should invoke the callback when complete', function (done) {
      var cb = after(2, done);
      var app = createApp(path.resolve(fixtures, 'name.txt'), cb);

      request(app)
      .get('/')
      .expect(200, cb);
    })

    it('should invoke the callback when client aborts', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        setImmediate(function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'), function (err) {
            should(err).be.ok;
            err.code.should.equal('ECONNABORT');
            cb();
          });
        });
        test.abort();
      });

      var test = request(app).get('/');
      test.expect(200, cb);
    })

    it('should invoke the callback when client already aborted', function (done) {
      var cb = after(1, done);
      var app = express();

      app.use(function (req, res) {
        onFinished(res, function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'), function (err) {
            should(err).be.ok;
            err.code.should.equal('ECONNABORT');
            cb();
          });
        });
        test.abort();
      });

      var test = request(app).get('/');
      test.expect(200, cb);
    })

    it('should invoke the callback on 404', function(done){
      var app = express();

      app.use(function (req, res) {
        res.sendFile(path.resolve(fixtures, 'does-not-exist'), function (err) {
          should(err).be.ok;
          err.status.should.equal(404);
          res.send('got it');
        });
      });

      request(app)
      .get('/')
      .expect(200, 'got it', done);
    })
  })
})

function createApp(path, options, fn) {
  var app = express();

  app.use(function (req, res) {
    res.sendFile(path, options, fn);
  });

  return app;
}
