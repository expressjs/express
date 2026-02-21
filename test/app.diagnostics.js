'use strict'

var assert = require('node:assert')
var diagnosticsChannel = require('node:diagnostics_channel')
var express = require('..')
var request = require('supertest')

describe('app diagnostics', function () {
  describe('express.request channel', function () {
    it('should publish when a request is received', function (done) {
      var app = express()
      var messages = []

      app.get('/', function (req, res) {
        res.send('ok')
      })

      diagnosticsChannel.subscribe('express.request', function (message) {
        messages.push(message)
      })

      request(app)
        .get('/')
        .expect(200, function (err) {
          diagnosticsChannel.unsubscribe('express.request', function () {})
          if (err) return done(err)
          assert.strictEqual(messages.length, 1)
          assert.ok(messages[0].req, 'message should have req')
          assert.ok(messages[0].res, 'message should have res')
          assert.ok(messages[0].app, 'message should have app')
          done()
        })
    })

    it('should include the request and response objects', function (done) {
      var app = express()
      var capturedMessage

      app.get('/hello', function (req, res) {
        res.send('world')
      })

      function onRequest (message) {
        capturedMessage = message
      }

      diagnosticsChannel.subscribe('express.request', onRequest)

      request(app)
        .get('/hello')
        .expect(200, function (err) {
          diagnosticsChannel.unsubscribe('express.request', onRequest)
          if (err) return done(err)
          assert.ok(capturedMessage, 'should have captured a message')
          assert.ok(capturedMessage.req, 'message should include req')
          assert.ok(capturedMessage.res, 'message should include res')
          assert.strictEqual(typeof capturedMessage.app, 'function', 'message.app should be the express app')
          done()
        })
    })

    it('should not publish when there are no subscribers', function (done) {
      var app = express()

      app.get('/', function (req, res) {
        res.send('ok')
      })

      // No subscriber - should work fine without throwing
      request(app)
        .get('/')
        .expect(200, done)
    })
  })
})
