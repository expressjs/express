'use strict';

var express = require('../');
var request = require('supertest');
var assert = require('node:assert');
var dc = require('node:diagnostics_channel');

describe('diagnostics', function () {
  it('should publish express.request.start', function (done) {
    var app = express();
    var events = [];

    dc.subscribe('express.request.start', function (message) {
      events.push(message);
    });

    app.get('/', function (req, res) {
      res.send('ok');
    });

    request(app)
            .get('/')
            .expect(200, function (err) {
              if (err) return done(err);
              assert.strictEqual(events.length, 1);
              assert.ok(events[0].req);
              assert.ok(events[0].res);
              done();
            });
  });

  it('should publish express.request.end', function (done) {
    var app = express();
    var events = [];

    dc.subscribe('express.request.end', function (message) {
      events.push(message);
    });

    app.get('/', function (req, res) {
      res.send('ok');
    });

    request(app)
            .get('/')
            .expect(200, function (err) {
              if (err) return done(err);
              // Wait a bit for on-finished to fire
              setTimeout(function () {
                assert.strictEqual(events.length, 1);
                assert.ok(events[0].req);
                assert.ok(events[0].res);
                assert.strictEqual(typeof events[0].duration, 'number');
                done();
              }, 10);
            });
  });

  it('should publish express.request.error', function (done) {
    var app = express();
    var events = [];

    dc.subscribe('express.request.error', function (message) {
      events.push(message);
    });

    app.get('/', function (req, res, next) {
      next(new Error('boom'));
    });

    request(app)
            .get('/')
            .expect(500, function (err) {
              if (err) return done(err);
              assert.strictEqual(events.length, 1);
              assert.strictEqual(events[0].error.message, 'boom');
              done();
            });
  });

  it('should publish express.middleware events', function (done) {
    var app = express();
    var startEvents = [];
    var endEvents = [];

    dc.subscribe('express.middleware.start', function (message) {
      startEvents.push(message);
    });

    dc.subscribe('express.middleware.end', function (message) {
      endEvents.push(message);
    });

    function myMiddleware(req, res, next) {
      next();
    }

    app.use(myMiddleware);

    app.get('/', function (req, res) {
      res.send('ok');
    });

    request(app)
            .get('/')
            .expect(200, function (err) {
              if (err) return done(err);
              assert.ok(startEvents.some(e => e.name === 'myMiddleware'));
              assert.ok(endEvents.some(e => e.name === 'myMiddleware'));
              done();
            });
  });

  it('should publish express.route.match', function (done) {
    var app = express();
    var events = [];

    dc.subscribe('express.route.match', function (message) {
      events.push(message);
    });

    app.get('/user/:id', function (req, res) {
      res.send('ok');
    });

    request(app)
            .get('/user/123')
            .expect(200, function (err) {
              if (err) return done(err);
              assert.strictEqual(events.length, 1);
              assert.strictEqual(events[0].route.path, '/user/:id');
              done();
            });
  });
});
