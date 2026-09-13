'use strict'

var express = require('..')
var request = require('supertest')

describe('res', function () {
  describe('.sendStatus(statusCode)', function () {
    it('should send the status code and message as body', function (done) {
      var app = express();

      app.use(function(req, res){
        res.sendStatus(201);
      });

      request(app)
      .get('/')
      .expect(201, 'Created', done);
    })

    it('should work with unknown code', function (done) {
      var app = express();

      app.use(function(req, res){
        res.sendStatus(599);
      });

      request(app)
      .get('/')
      .expect(599, '599', done);
    })

    it('should raise error for invalid status code', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.sendStatus(undefined).end()
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
    })

    it('should raise error for null status code', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.sendStatus(null).end()
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
    })

    it('should raise error for string status code', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.sendStatus('200').end()
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
    })

    it('should raise error for NaN status code', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.sendStatus(NaN).end()
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
    })
  })
})
