'use strict'

var assert = require('node:assert')
var express = require('..')
var request = require('supertest')

describe('logerror', function () {
  it('should log the full error object', function (done) {
    var app = express()
    app.set('env', 'development')

    var logged
    var original = console.error
    console.error = function (err) {
      logged = err
    }

    app.use(function (req, res, next) {
      var inner = new Error('inner')
      next(new Error('outer', { cause: inner }))
    })

    request(app)
      .get('/')
      .expect(500, function (err) {
        if (err) {
          console.error = original
          return done(err)
        }
        setImmediate(function () {
          console.error = original
          assert.ok(logged instanceof Error)
          assert.strictEqual(logged.message, 'outer')
          assert.ok(logged.cause instanceof Error)
          assert.strictEqual(logged.cause.message, 'inner')
          done()
        })
      })
  })
})
