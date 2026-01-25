'use strict';

const request = require('supertest');
const express = require('../');

describe('res.redirect(undefined)', function () {
  it('should not set Location header to "undefined"', function (done) {
    const app = express();

    app.get('/', function (req, res) {
      res.redirect(undefined);
    });

    request(app)
      .get('/')
      .expect(302)
      .expect(function (res) {
        if (res.headers.location === 'undefined') {
          throw new Error('Location header is "undefined"');
        }
      })
      .end(done);
  });
});
