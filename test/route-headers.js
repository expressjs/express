'use strict';

var express = require('../');
var assert = require('node:assert');

describe('Route headers matching', function () {
  describe('app.METHOD with headers option', function () {
    it('should match route with exact header value', function (done) {
      var app = express();

      app.get('/test', { headers: { 'X-API-Version': '1.0' } }, function (req, res) {
        res.end('v1');
      });

      app.get('/test', { headers: { 'X-API-Version': '2.0' } }, function (req, res) {
        res.end('v2');
      });

      var res1 = { end: function (val) { assert.strictEqual(val, 'v1'); } };
      var res2 = { end: function (val) { assert.strictEqual(val, 'v2'); done(); } };

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } }, res1, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '2.0' } }, res2, function () {
        throw new Error('should not be called');
      });
    });

    it('should match route with regex header value', function (done) {
      var app = express();

      app.get('/test', { headers: { 'Accept': /^application\/json/ } }, function (req, res) {
        res.end('json');
      });

      app.get('/test', { headers: { 'Accept': /^text\/html/ } }, function (req, res) {
        res.end('html');
      });

      var res1 = { end: function (val) { assert.strictEqual(val, 'json'); } };
      var res2 = { end: function (val) { assert.strictEqual(val, 'html'); done(); } };

      app.handle({ url: '/test', method: 'GET', headers: { 'accept': 'application/json' } }, res1, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/test', method: 'GET', headers: { 'accept': 'text/html' } }, res2, function () {
        throw new Error('should not be called');
      });
    });

    it('should match route with function header matcher', function (done) {
      var app = express();

      app.get('/test', { headers: { 'X-API-Version': function (val) { return parseInt(val, 10) < 2; } } }, function (req, res) {
        res.end('old');
      });

      app.get('/test', { headers: { 'X-API-Version': function (val) { return parseInt(val, 10) >= 2; } } }, function (req, res) {
        res.end('new');
      });

      var res1 = { end: function (val) { assert.strictEqual(val, 'old'); } };
      var res2 = { end: function (val) { assert.strictEqual(val, 'new'); done(); } };

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '1' } }, res1, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '2' } }, res2, function () {
        throw new Error('should not be called');
      });
    });

    it('should skip to next route when headers do not match', function (done) {
      var app = express();
      var called = [];

      app.get('/test', { headers: { 'X-API-Version': 'nonexistent' } }, function (req, res) {
        called.push('wrong');
        res.end('wrong');
      });

      app.get('/test', function (req, res) {
        called.push('correct');
        res.end('correct');
      });

      var res = {
        end: function (val) {
          assert.strictEqual(val, 'correct');
          assert.deepStrictEqual(called, ['correct']);
          done();
        }
      };

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } }, res, function () {
        throw new Error('should not be called');
      });
    });

    it('should work with multiple header conditions', function (done) {
      var app = express();

      app.get('/test', {
        headers: {
          'X-API-Version': '1.0',
          'Accept': 'application/json'
        }
      }, function (req, res) {
        res.end('v1-json');
      });

      app.get('/test', {
        headers: {
          'X-API-Version': '1.0',
          'Accept': 'text/html'
        }
      }, function (req, res) {
        res.end('v1-html');
      });

      var res1 = { end: function (val) { assert.strictEqual(val, 'v1-json'); } };
      var res2 = { end: function (val) { assert.strictEqual(val, 'v1-html'); done(); } };

      app.handle({
        url: '/test',
        method: 'GET',
        headers: { 'x-api-version': '1.0', 'accept': 'application/json' }
      }, res1, function () {
        throw new Error('should not be called');
      });

      app.handle({
        url: '/test',
        method: 'GET',
        headers: { 'x-api-version': '1.0', 'accept': 'text/html' }
      }, res2, function () {
        throw new Error('should not be called');
      });
    });

    it('should maintain backward compatibility without headers option', function (done) {
      var app = express();

      app.get('/test', function (req, res) {
        res.end('normal');
      });

      var res = {
        end: function (val) {
          assert.strictEqual(val, 'normal');
          done();
        }
      };

      app.handle({ url: '/test', method: 'GET', headers: {} }, res, function () {
        throw new Error('should not be called');
      });
    });
  });

  describe('app.route with headers option', function () {
    it('should work with app.route and headers option', function (done) {
      var app = express();

      app.route('/test', { headers: { 'X-API-Version': '1.0' } })
        .get(function (req, res) {
          res.end('v1-get');
        })
        .post(function (req, res) {
          res.end('v1-post');
        });

      app.route('/test', { headers: { 'X-API-Version': '2.0' } })
        .get(function (req, res) {
          res.end('v2-get');
        });

      var res1 = { end: function (val) { assert.strictEqual(val, 'v1-get'); } };
      var res2 = { end: function (val) { assert.strictEqual(val, 'v1-post'); } };
      var res3 = { end: function (val) { assert.strictEqual(val, 'v2-get'); done(); } };

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } }, res1, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/test', method: 'POST', headers: { 'x-api-version': '1.0' } }, res2, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '2.0' } }, res3, function () {
        throw new Error('should not be called');
      });
    });

    it('should work with app.route and chained .all()', function (done) {
      var app = express();
      var called = [];

      app.route('/test', { headers: { 'X-API-Version': '1.0' } })
        .all(function (req, res, next) {
          called.push('all-v1');
          next();
        })
        .get(function (req, res) {
          called.push('get-v1');
          res.end('v1');
        });

      var res = {
        end: function (val) {
          assert.strictEqual(val, 'v1');
          assert.deepStrictEqual(called, ['all-v1', 'get-v1']);
          done();
        }
      };

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } }, res, function () {
        throw new Error('should not be called');
      });
    });
  });

  describe('app.all with headers option', function () {
    it('should work with app.all and headers option', function (done) {
      var app = express();
      var methods = [];

      app.all('/test', { headers: { 'X-API-Version': '1.0' } }, function (req, res) {
        methods.push(req.method);
        res.end('ok');
      });

      var res = { end: function () {} };

      app.handle({ url: '/test', method: 'GET', headers: { 'x-api-version': '1.0' } }, res, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/test', method: 'POST', headers: { 'x-api-version': '1.0' } }, res, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/test', method: 'PUT', headers: { 'x-api-version': '2.0' } }, res, function () {
        assert.deepStrictEqual(methods, ['GET', 'POST']);
        done();
      });
    });
  });

  describe('API versioning use case', function () {
    it('should support typical API versioning pattern', function (done) {
      var app = express();

      app.get('/api/users', { headers: { 'X-API-Version': '1' } }, function (req, res) {
        res.json([{ id: 1, name: 'John' }]);
      });

      app.get('/api/users', { headers: { 'X-API-Version': '2' } }, function (req, res) {
        res.json({ data: [{ id: 1, firstName: 'John', lastName: 'Doe' }], meta: { total: 1 } });
      });

      app.get('/api/users', function (req, res) {
        res.statusCode = 400;
        res.json({ error: 'API version required' });
      });

      var v1Res = {
        statusCode: 200,
        json: function (val) {
          assert.deepStrictEqual(val, [{ id: 1, name: 'John' }]);
        }
      };

      var v2Res = {
        statusCode: 200,
        json: function (val) {
          assert.deepStrictEqual(val, {
            data: [{ id: 1, firstName: 'John', lastName: 'Doe' }],
            meta: { total: 1 }
          });
        }
      };

      var defaultRes = {
        statusCode: 200,
        json: function (val) {
          assert.strictEqual(this.statusCode, 400);
          assert.deepStrictEqual(val, { error: 'API version required' });
          done();
        }
      };

      app.handle({ url: '/api/users', method: 'GET', headers: { 'x-api-version': '1' } }, v1Res, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/api/users', method: 'GET', headers: { 'x-api-version': '2' } }, v2Res, function () {
        throw new Error('should not be called');
      });

      app.handle({ url: '/api/users', method: 'GET', headers: {} }, defaultRes, function () {
        throw new Error('should not be called');
      });
    });
  });
});
