'use strict'

const assert = require('node:assert')
const express = require('../')

describe('config', () => {
  describe('.set()', () => {
    it('should set a value', () => {
      const app = express()
      app.set('foo', 'bar')
      assert.equal(app.get('foo'), 'bar')
    })

    it('should set prototype values', () => {
      const app = express()
      app.set('hasOwnProperty', 42)
      assert.strictEqual(app.get('hasOwnProperty'), 42)
    })

    it('should return the app', () => {
      const app = express()
      assert.equal(app.set('foo', 'bar'), app)
    })

    it('should return the app when undefined', () => {
      const app = express()
      assert.equal(app.set('foo', undefined), app)
    })

    it('should return set value', () => {
      const app = express()
      app.set('foo', 'bar')
      assert.strictEqual(app.set('foo'), 'bar')
    })

    it('should return undefined for prototype values', () => {
      const app = express()
      assert.strictEqual(app.set('hasOwnProperty'), undefined)
    })

    describe('"etag"', () => {
      it('should throw on bad value', () => {
        const app = express()
        assert.throws(app.set.bind(app, 'etag', 42), /unknown value/)
      })

      it('should set "etag fn"', () => {
        const app = express()
        const fn = function () {}
        app.set('etag', fn)
        assert.equal(app.get('etag fn'), fn)
      })
    })

    describe('"trust proxy"', () => {
      it('should set "trust proxy fn"', () => {
        const app = express()
        const fn = function () {}
        app.set('trust proxy', fn)
        assert.equal(app.get('trust proxy fn'), fn)
      })
    })
  })

  describe('.get()', () => {
    it('should return undefined when unset', () => {
      const app = express()
      assert.strictEqual(app.get('foo'), undefined)
    })

    it('should return undefined for prototype values', () => {
      const app = express()
      assert.strictEqual(app.get('hasOwnProperty'), undefined)
    })

    it('should otherwise return the value', () => {
      const app = express()
      app.set('foo', 'bar')
      assert.equal(app.get('foo'), 'bar')
    })

    describe('when mounted', () => {
      it('should default to the parent app', () => {
        const app = express()
        const blog = express()

        app.set('title', 'Express')
        app.use(blog)
        assert.equal(blog.get('title'), 'Express')
      })

      it('should given precedence to the child', () => {
        const app = express()
        const blog = express()

        app.use(blog)
        app.set('title', 'Express')
        blog.set('title', 'Some Blog')

        assert.equal(blog.get('title'), 'Some Blog')
      })

      it('should inherit "trust proxy" setting', () => {
        const app = express()
        const blog = express()

        function fn () { return false }

        app.set('trust proxy', fn)
        assert.equal(app.get('trust proxy'), fn)
        assert.equal(app.get('trust proxy fn'), fn)

        app.use(blog)

        assert.equal(blog.get('trust proxy'), fn)
        assert.equal(blog.get('trust proxy fn'), fn)
      })

      it('should prefer child "trust proxy" setting', () => {
        const app = express()
        const blog = express()

        function fn1 () { return false }
        function fn2 () { return true }

        app.set('trust proxy', fn1)
        assert.equal(app.get('trust proxy'), fn1)
        assert.equal(app.get('trust proxy fn'), fn1)

        blog.set('trust proxy', fn2)
        assert.equal(blog.get('trust proxy'), fn2)
        assert.equal(blog.get('trust proxy fn'), fn2)

        app.use(blog)

        assert.equal(app.get('trust proxy'), fn1)
        assert.equal(app.get('trust proxy fn'), fn1)
        assert.equal(blog.get('trust proxy'), fn2)
        assert.equal(blog.get('trust proxy fn'), fn2)
      })
    })
  })

  describe('.enable()', () => {
    it('should set the value to true', () => {
      const app = express()
      assert.equal(app.enable('tobi'), app)
      assert.strictEqual(app.get('tobi'), true)
    })

    it('should set prototype values', () => {
      const app = express()
      app.enable('hasOwnProperty')
      assert.strictEqual(app.get('hasOwnProperty'), true)
    })
  })

  describe('.disable()', () => {
    it('should set the value to false', () => {
      const app = express()
      assert.equal(app.disable('tobi'), app)
      assert.strictEqual(app.get('tobi'), false)
    })

    it('should set prototype values', () => {
      const app = express()
      app.disable('hasOwnProperty')
      assert.strictEqual(app.get('hasOwnProperty'), false)
    })
  })

  describe('.enabled()', () => {
    it('should default to false', () => {
      const app = express()
      assert.strictEqual(app.enabled('foo'), false)
    })

    it('should return true when set', () => {
      const app = express()
      app.set('foo', 'bar')
      assert.strictEqual(app.enabled('foo'), true)
    })

    it('should default to false for prototype values', () => {
      const app = express()
      assert.strictEqual(app.enabled('hasOwnProperty'), false)
    })
  })

  describe('.disabled()', () => {
    it('should default to true', () => {
      const app = express()
      assert.strictEqual(app.disabled('foo'), true)
    })

    it('should return false when set', () => {
      const app = express()
      app.set('foo', 'bar')
      assert.strictEqual(app.disabled('foo'), false)
    })

    it('should default to true for prototype values', () => {
      const app = express()
      assert.strictEqual(app.disabled('hasOwnProperty'), true)
    })
  })
})
