'use strict'

var assert = require('node:assert')
var express = require('..')
var request = require('supertest')

describe('logerror', function () {
  var original

  beforeEach(function () {
    original = console.error
  })

  afterEach(function () {
    if (original) {
      console.error = original
    }
  })

  it('should log the full error object', function (done) {
    var app = express()
    app.set('env', 'development')

    var logged
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
        if (err) return done(err)
        setImmediate(function () {
          assert.ok(logged instanceof Error)
          assert.strictEqual(logged.message, 'outer')
          assert.ok(logged.cause instanceof Error)
          assert.strictEqual(logged.cause.message, 'inner')
          done()
        })
      })
  })
})
