'use strict'

var assert = require('node:assert')
var dc = require('node:diagnostics_channel')
var express = require('..')
var request = require('supertest')

describe('diagnostics channels', function () {
  describe('express.request.start', function () {
    it('should publish before routing begins', function (done) {
      var app = express()
      var published = false

      app.get('/', function (req, res) {
        res.send('ok')
      })

      var channel = dc.channel('express.request.start')
      function onMessage(message) {
        published = true
        assert.ok(message.req, 'message should contain req')
        assert.ok(message.res, 'message should contain res')
        assert.strictEqual(message.req.url, '/')
      }
      channel.subscribe(onMessage)

      request(app)
        .get('/')
        .expect(200, function (err) {
          channel.unsubscribe(onMessage)
          if (err) return done(err)
          assert.ok(published, 'express.request.start should have been published')
          done()
        })
    })

    it('should publish for every request', function (done) {
      var app = express()
      var count = 0

      app.get('/', function (req, res) {
        res.send('ok')
      })

      var channel = dc.channel('express.request.start')
      function onMessage() {
        count++
      }
      channel.subscribe(onMessage)

      request(app)
        .get('/')
        .expect(200, function (err) {
          if (err) { channel.unsubscribe(onMessage); return done(err) }
          request(app)
            .get('/')
            .expect(200, function (err) {
              channel.unsubscribe(onMessage)
              if (err) return done(err)
              assert.strictEqual(count, 2, 'should publish for each request')
              done()
            })
        })
    })

    it('should not add overhead when no subscribers', function (done) {
      var app = express()

      app.get('/', function (req, res) {
        res.send('ok')
      })

      // no subscribers — just verify the request works
      request(app)
        .get('/')
        .expect(200, done)
    })
  })

  describe('express.request.finish', function () {
    it('should publish after response is sent', function (done) {
      var app = express()
      var published = false

      app.get('/', function (req, res) {
        res.send('ok')
      })

      var channel = dc.channel('express.request.finish')
      function onMessage(message) {
        published = true
        assert.ok(message.req, 'message should contain req')
        assert.ok(message.res, 'message should contain res')
        assert.strictEqual(message.res.statusCode, 200)
      }
      channel.subscribe(onMessage)

      request(app)
        .get('/')
        .expect(200, function (err) {
          // give onFinished a tick to fire
          setImmediate(function () {
            channel.unsubscribe(onMessage)
            if (err) return done(err)
            assert.ok(published, 'express.request.finish should have been published')
            done()
          })
        })
    })

    it('should publish for error responses', function (done) {
      var app = express()
      var finishStatus = null

      app.get('/', function (req, res) {
        res.status(500).send('Internal Server Error')
      })

      var channel = dc.channel('express.request.finish')
      function onMessage(message) {
        finishStatus = message.res.statusCode
      }
      channel.subscribe(onMessage)

      request(app)
        .get('/')
        .expect(500, function (err) {
          setImmediate(function () {
            channel.unsubscribe(onMessage)
            if (err) return done(err)
            assert.strictEqual(finishStatus, 500, 'should capture error status code')
            done()
          })
        })
    })

    it('should publish for 404 responses', function (done) {
      var app = express()
      var finishStatus = null

      // no routes — will 404

      var channel = dc.channel('express.request.finish')
      function onMessage(message) {
        finishStatus = message.res.statusCode
      }
      channel.subscribe(onMessage)

      request(app)
        .get('/nonexistent')
        .expect(404, function (err) {
          setImmediate(function () {
            channel.unsubscribe(onMessage)
            if (err) return done(err)
            assert.strictEqual(finishStatus, 404, 'should capture 404 status')
            done()
          })
        })
    })
  })

  describe('express.request.error', function () {
    it('should not publish on normal responses', function (done) {
      var app = express()
      var errorPublished = false

      app.get('/', function (req, res) {
        res.send('ok')
      })

      var channel = dc.channel('express.request.error')
      function onMessage() {
        errorPublished = true
      }
      channel.subscribe(onMessage)

      request(app)
        .get('/')
        .expect(200, function (err) {
          setImmediate(function () {
            channel.unsubscribe(onMessage)
            if (err) return done(err)
            assert.ok(!errorPublished, 'express.request.error should not publish on success')
            done()
          })
        })
    })
  })

  describe('channel isolation', function () {
    it('should publish start before finish', function (done) {
      var app = express()
      var order = []

      app.get('/', function (req, res) {
        res.send('ok')
      })

      var startChannel = dc.channel('express.request.start')
      var finishChannel = dc.channel('express.request.finish')

      function onStart() { order.push('start') }
      function onFinish() { order.push('finish') }

      startChannel.subscribe(onStart)
      finishChannel.subscribe(onFinish)

      request(app)
        .get('/')
        .expect(200, function (err) {
          setImmediate(function () {
            startChannel.unsubscribe(onStart)
            finishChannel.unsubscribe(onFinish)
            if (err) return done(err)
            assert.deepStrictEqual(order, ['start', 'finish'], 'start should fire before finish')
            done()
          })
        })
    })
  })
})
