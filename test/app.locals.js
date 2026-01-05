'use strict'

const assert = require('node:assert')
const express = require('../')

describe('app', () => {
  describe('.locals', () => {
    it('should default object with null prototype', () => {
      const app = express()
      assert.ok(app.locals)
      assert.strictEqual(typeof app.locals, 'object')
      assert.strictEqual(Object.getPrototypeOf(app.locals), null)
    })

    describe('.settings', () => {
      it('should contain app settings ', () => {
        const app = express()
        app.set('title', 'Express')
        assert.ok(app.locals.settings)
        assert.strictEqual(typeof app.locals.settings, 'object')
        assert.strictEqual(app.locals.settings, app.settings)
        assert.strictEqual(app.locals.settings.title, 'Express')
      })
    })
  })
})
