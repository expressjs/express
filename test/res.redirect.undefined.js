'use strict'

var express = require('..')
var request = require('supertest')

describe('res.redirect - Issue #6942', function () {
  describe('when redirect argument is undefined', function () {
    it('should throw a TypeError with correct message', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.redirect(undefined)
      })

      app.use(function (err, req, res, next) {
        res.status(500).json({
          error: err.message,
          type: err.name,
          stack: err.stack
        })
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if (res.body.type !== 'TypeError') {
            throw new Error('Expected TypeError, got ' + res.body.type)
          }
          if (res.body.error !== 'path argument is required to res.redirect') {
            throw new Error(
              'Unexpected error message: ' + res.body.error
            )
          }
          if (!res.body.stack) {
            throw new Error('Expected error stack to be present')
          }
        })
        .end(done)
    })

    it('should not send a Location header when redirect throws', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.redirect(undefined)
      })

      app.use(function (err, req, res, next) {
        res.status(500).send('error')
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          if ('location' in res.headers) {
            throw new Error('Location header should not exist when redirect throws')
          }
        })
        .end(done)
    })
  })
})
