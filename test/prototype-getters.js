const assert = require('assert');
const express = require('../');
const request = require('supertest');

describe('prototype getters', function () {
  it('protocol should resolve from prototype', function (done) {
    const app = express();
    app.get('/', (req, res) => {
      res.json({ proto: req.protocol });
    });

    request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        assert.strictEqual(res.body.proto, 'http');
      })
      .end(done);
  });
});
