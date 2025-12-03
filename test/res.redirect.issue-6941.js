'use strict'

var express = require('..');
var request = require('supertest');

describe('res.redirect - Issue #6941', function () {
  describe('when url is undefined', function () {
    it('should throw a TypeError', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect(undefined);
      });

      app.use(function (err, req, res, next) {
        res.status(500).json({
          error: err.message,
          type: err.name
        });
      });

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if (res.body.type !== 'TypeError') {
            throw new Error('Expected TypeError, got ' + res.body.type);
          }
          if (res.body.error !== 'url argument is required to res.redirect') {
            throw new Error('Unexpected error message: ' + res.body.error);
          }
        })
        .end(done);
    });

    it('should not send Location: undefined header', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect(undefined);
      });

      app.use(function (err, req, res, next) {
        res.status(500).send('error');
      });

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if (res.headers.location === 'undefined') {
            throw new Error('Location header should not be "undefined"');
          }
        })
        .end(done);
    });
  });

  describe('when url is not a string', function () {
    it('should throw a TypeError for null', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect(null);
      });

      app.use(function (err, req, res, next) {
        res.status(500).json({
          error: err.message,
          type: err.name
        });
      });

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if (res.body.type !== 'TypeError') {
            throw new Error('Expected TypeError, got ' + res.body.type);
          }
        })
        .end(done);
    });

    it('should throw a TypeError for number (when single argument)', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect(123);
      });

      app.use(function (err, req, res, next) {
        res.status(500).json({
          error: err.message,
          type: err.name
        });
      });

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if (res.body.type !== 'TypeError') {
            throw new Error('Expected TypeError, got ' + res.body.type);
          }
        })
        .end(done);
    });

    it('should throw a TypeError for object', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect({ url: '/home' });
      });

      app.use(function (err, req, res, next) {
        res.status(500).json({
          error: err.message,
          type: err.name
        });
      });

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if (res.body.type !== 'TypeError') {
            throw new Error('Expected TypeError, got ' + res.body.type);
          }
        })
        .end(done);
    });
  });

  describe('when status and url are provided', function () {
    it('should throw a TypeError if url is undefined', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect(301, undefined);
      });

      app.use(function (err, req, res, next) {
        res.status(500).json({
          error: err.message,
          type: err.name
        });
      });

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if (res.body.type !== 'TypeError') {
            throw new Error('Expected TypeError, got ' + res.body.type);
          }
          if (res.body.error !== 'url argument is required to res.redirect') {
            throw new Error('Unexpected error message: ' + res.body.error);
          }
        })
        .end(done);
    });

    it('should work correctly with valid status and url', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect(301, '/new-location');
      });

      request(app)
        .get('/')
        .expect('Location', '/new-location')
        .expect(301, done);
    });
  });

  describe('valid redirects should still work', function () {
    it('should redirect with a string url', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect('/home');
      });

      request(app)
        .get('/')
        .expect('Location', '/home')
        .expect(302, done);
    });

    it('should redirect with empty string', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.redirect('');
      });

      request(app)
        .get('/')
        .expect('Location', '')
        .expect(302, done);
    });
  });
});
