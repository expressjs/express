'use strict';

const express = require('..');
const request = require('supertest');
const requestContext = require('../lib/middleware/request-context');

describe('middleware request-context', function () {
  it('provides stable store across async boundaries', function (done) {
    const app = express();
    app.use(requestContext());

    app.get('/', function (req, res) {
      const id = req.requestId;
      setTimeout(function () {
        const store = requestContext.getStore();
        res.json({ ok: !!store && store.id === id });
      }, 5);
    });

    request(app)
      .get('/')
      .expect(200)
      .expect(function (res) {
        if (!res.body || res.body.ok !== true) throw new Error('context not preserved');
      })
      .end(done);
  });

  it('honors custom header name for request id', function (done) {
    const app = express();
    app.use(requestContext({ header: 'X-Correlation-ID' }));

    app.get('/', function (req, res) {
      res.end(req.requestId);
    });

    request(app)
      .get('/')
      .set('X-Correlation-ID', 'abc123')
      .expect(200, 'abc123', done);
  });
});
