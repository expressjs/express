'use strict'

const dc = require('node:diagnostics_channel')
const express = require('../')
const assert = require('node:assert')

describe('diagnostics channels', function () {
  describe('express.initialization', function () {
    it('should publish when app is created', function () {
      let msg

      dc.subscribe('express.initialization', function handler (data) {
        msg = data
        dc.unsubscribe('express.initialization', handler)
      })

      const app = express()
      assert.ok(msg, 'express.initialization was not published')
      assert.strictEqual(msg.express, app)
    })

    it('should not throw when there are no subscribers', function () {
      assert.ok(express())
    })
  })
})
