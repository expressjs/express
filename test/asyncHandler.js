'use strict';

const express = require('..');
const request = require('supertest');

describe('express.asyncHandler', function () {
  it('should handle async success', function (done) {
    const app = express();

    app.get('/', express.asyncHandler(async (req, res) => {
      res.send('ok');
    }));

    request(app)
      .get('/')
      .expect(200, 'ok', done);
  });

  it('should catch async errors and forward to error handler', function (done) {
    const app = express();

    app.get('/', express.asyncHandler(async () => {
      throw new Error('fail');
    }));

    app.use((err, req, res, next) => {
      res.status(500).send(err.message);
    });

    request(app)
      .get('/')
      .expect(500, 'fail', done);
  });
});
