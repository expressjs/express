
var express = require('../');
var request = require('supertest');
var Promise = require('bluebird');

describe('middleware', function () {
  describe('promises', function () {
    it('resolving will be waited on', function (done) {
      var app = express();
      var count = 0;

      app.use(function (req, res) {
        count++;
        return new Promise(function (resolve, reject) {
          count++;
          setTimeout(function () {
            count++;
            resolve();
          }, 5);
        });
      });

      app.use(function (req, res) {
        count.should.be.exactly(3);
        res.end('Awesome!')
      });

      request(app)
      .get('/')
      .expect(200, done);
    });

    it('rejecting will trigger error handlers', function (done) {
      var app = express();

      app.use(function (req, res) {
        return new Promise(function (resolve, reject) {
          reject(new Error('Happy error'));
        });
      });

      request(app)
      .get('/')
      .expect(500, done);
    });

    it('will be ignored if next is called', function (done) {
      var app = express();
      var count = 0;

      app.use(function (req, res, next) {
        count++;
        return new Promise(function (resolve, reject) {
          count++;
          next();
          setTimeout(function () {
            count++;
            resolve();
          }, 5);
        });
      });

      app.use(function (req, res) {
        count.should.be.exactly(2);
        res.end('Awesome!');
      });

      request(app)
      .get('/')
      .expect(200, done);
    });

    it('can be used in error handlers', function (done) {
      var app = express();
      var count = 0;

      app.use(function (req, res, next) {
        count++;
        next(new Error('Happy error'));
      });

      app.use(function (error, req, res, next) {
        count++;
        return new Promise(function (resolve, reject) {
          count++
          setTimeout(function () {
            count++;
            next(error);
            resolve();
          }, 5);
        });
      });

      app.use(function () {
        done(new Error('This should never be reached'));
      });

      app.use(function (error, req, res, next) {
        count.should.be.exactly(4);
        res.end('Awesome!');
      });

      request(app)
      .get('/')
      .expect(200, done);
    });
  });
});
