'use strict'

var express = require('..');
var request = require('supertest');

describe('res.status - Issue #6756', function () {
  describe('when status code is a BigInt', function () {
    it('should throw a TypeError with a meaningful message', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(200n);
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
          if (!res.body.error.includes('200')) {
            throw new Error('Error message should include the value: ' + res.body.error);
          }
          if (!res.body.error.includes('bigint')) {
            throw new Error('Error message should include the type: ' + res.body.error);
          }
        })
        .end(done);
    });

    it('should not crash with uncaught exception', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendStatus(200n);
      });

      app.use(function (err, req, res, next) {
        // Error was caught properly, not an uncaught exception
        res.status(500).send('caught');
      });

      request(app)
        .get('/')
        .expect(500)
        .expect('caught')
        .end(done);
    });
  });

  describe('when status code is invalid type', function () {
    it('should throw TypeError for string', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status('200');
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

    it('should throw TypeError for null', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(null);
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

    it('should throw TypeError for undefined', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(undefined);
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

    it('should throw TypeError for float', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(200.5);
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

  describe('when status code is out of range', function () {
    it('should throw RangeError for code < 100', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(99);
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
          if (res.body.type !== 'RangeError') {
            throw new Error('Expected RangeError, got ' + res.body.type);
          }
        })
        .end(done);
    });

    it('should throw RangeError for code > 999', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(1000);
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
          if (res.body.type !== 'RangeError') {
            throw new Error('Expected RangeError, got ' + res.body.type);
          }
        })
        .end(done);
    });
  });

  describe('valid status codes should still work', function () {
    it('should accept valid integer status code', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(201).send('created');
      });

      request(app)
        .get('/')
        .expect(201)
        .expect('created')
        .end(done);
    });

    it('should work with sendStatus', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.sendStatus(204);
      });

      request(app)
        .get('/')
        .expect(204)
        .end(done);
    });
  });
});
