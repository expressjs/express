'use strict'

const express = require('../.');
const request = require('supertest');

describe('res', function () {
  describe('.status(code) strict mode', function () {
    it('should accept 599 when strict mode is enabled', function (done) {
      const app = express();
      app.set('strict status codes', true);

      app.use(function (req, res) {
        res.status(599).end();
      });

      request(app)
        .get('/')
        .expect(599, done);
    });

    it('should throw RangeError for 600 when strict mode is enabled', function (done) {
      const app = express();
      app.set('strict status codes', true);

      app.use(function (req, res) {
        try {
          res.status(600).end();
        } catch (err) {
          res.status(500).send(err.message);
        }
      });

      request(app)
        .get('/')
        .expect(500, /Status code must be greater than 99 and less than 600/, done);
    });

    it('should accept 600 when strict mode is disabled (default)', function (done) {
      const app = express();

      app.use(function (req, res) {
        res.status(600).end();
      });

      request(app)
        .get('/')
        .expect(600, done);
    });

    it('should throw RangeError for 999 when strict mode is enabled', function (done) {
      const app = express();
      app.set('strict status codes', true);

      app.use(function (req, res) {
        try {
          res.status(999).end();
        } catch (err) {
          res.status(500).send(err.message);
        }
      });

      request(app)
          .get('/')
          .expect(500, /Status code must be greater than 99 and less than 600/, done);
    });
  });
});
