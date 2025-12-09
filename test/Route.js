'use strict'

const after = require('after')
const assert = require('node:assert')
const { Route } = require('../')
const { methods } = require('../lib/utils')

describe('Route', () => {
  it('should work without handlers', (done) => {
    const req = { method: 'GET', url: '/' }
    const route = new Route('/foo')
    route.dispatch(req, {}, done)
  })

  it('should not stack overflow with a large sync stack', function (done) {
    this.timeout(5000) // long-running test

    const req = { method: 'GET', url: '/' }
    const route = new Route('/foo')

    route.get((req, res, next) => {
      req.counter = 0
      next()
    })

    for (let i = 0; i < 6000; i++) {
      route.all((req, res, next) => {
        req.counter++
        next()
      })
    }

    route.get((req, res, next) => {
      req.called = true
      next()
    })

    route.dispatch(req, {}, (err) => {
      if (err) return done(err)
      assert.ok(req.called)
      assert.strictEqual(req.counter, 6000)
      done()
    })
  })

  describe('.all', () => {
    it('should add handler', (done) => {
      const req = { method: 'GET', url: '/' }
      const route = new Route('/foo')

      route.all((req, res, next) => {
        req.called = true
        next()
      })

      route.dispatch(req, {}, (err) => {
        if (err) return done(err)
        assert.ok(req.called)
        done()
      })
    })

    it('should handle VERBS', (done) => {
      let count = 0
      const route = new Route('/foo')
      const cb = after(methods.length, (err) => {
        if (err) return done(err)
        assert.strictEqual(count, methods.length)
        done()
      })

      route.all((req, res, next) => {
        count++
        next()
      })

      methods.forEach((method) => {
        const req = { method, url: '/' }
        route.dispatch(req, {}, cb)
      })
    })

    it('should stack', (done) => {
      const req = { count: 0, method: 'GET', url: '/' }
      const route = new Route('/foo')

      route.all((req, res, next) => {
        req.count++
        next()
      })

      route.all((req, res, next) => {
        req.count++
        next()
      })

      route.dispatch(req, {}, (err) => {
        if (err) return done(err)
        assert.strictEqual(req.count, 2)
        done()
      })
    })
  })

  describe('.VERB', () => {
    it('should support .get', (done) => {
      const req = { method: 'GET', url: '/' }
      const route = new Route('')

      route.get((req, res, next) => {
        req.called = true
        next()
      })

      route.dispatch(req, {}, (err) => {
        if (err) return done(err)
        assert.ok(req.called)
        done()
      })
    })

    it('should limit to just .VERB', (done) => {
      const req = { method: 'POST', url: '/' }
      const route = new Route('')

      route.get(() => {
        throw new Error('not me!')
      })

      route.post((req, res, next) => {
        req.called = true
        next()
      })

      route.dispatch(req, {}, (err) => {
        if (err) return done(err)
        assert.ok(req.called)
        done()
      })
    })

    it('should allow fallthrough', (done) => {
      const req = { order: '', method: 'GET', url: '/' }
      const route = new Route('')

      route.get((req, res, next) => {
        req.order += 'a'
        next()
      })

      route.all((req, res, next) => {
        req.order += 'b'
        next()
      })

      route.get((req, res, next) => {
        req.order += 'c'
        next()
      })

      route.dispatch(req, {}, (err) => {
        if (err) return done(err)
        assert.strictEqual(req.order, 'abc')
        done()
      })
    })
  })

  describe('errors', () => {
    it('should handle errors via arity 4 functions', (done) => {
      const req = { order: '', method: 'GET', url: '/' }
      const route = new Route('')

      route.all((req, res, next) => {
        next(new Error('foobar'))
      })

      route.all((req, res, next) => {
        req.order += '0'
        next()
      })

      route.all((err, req, res, next) => {
        req.order += 'a'
        next(err)
      })

      route.dispatch(req, {}, (err) => {
        assert.ok(err)
        assert.strictEqual(err.message, 'foobar')
        assert.strictEqual(req.order, 'a')
        done()
      })
    })

    it('should handle throw', (done) => {
      const req = { order: '', method: 'GET', url: '/' }
      const route = new Route('')

      route.all(() => {
        throw new Error('foobar')
      })

      route.all((req, res, next) => {
        req.order += '0'
        next()
      })

      route.all((err, req, res, next) => {
        req.order += 'a'
        next(err)
      })

      route.dispatch(req, {}, (err) => {
        assert.ok(err)
        assert.strictEqual(err.message, 'foobar')
        assert.strictEqual(req.order, 'a')
        done()
      })
    })

    it('should handle throwing inside error handlers', (done) => {
      const req = { method: 'GET', url: '/' }
      const route = new Route('')

      route.get(() => {
        throw new Error('boom!')
      })

      route.get((err, req, res, next) => {
        throw new Error('oops')
      })

      route.get((err, req, res, next) => {
        req.message = err.message
        next()
      })

      route.dispatch(req, {}, (err) => {
        if (err) return done(err)
        assert.strictEqual(req.message, 'oops')
        done()
      })
    })

    it('should handle throw in .all', (done) => {
      const req = { method: 'GET', url: '/' }
      const route = new Route('')

      route.all((req, res, next) => {
        throw new Error('boom!')
      })

      route.dispatch(req, {}, (err) => {
        assert.ok(err)
        assert.strictEqual(err.message, 'boom!')
        done()
      })
    })

    it('should handle single error handler', (done) => {
      const req = { method: 'GET', url: '/' }
      const route = new Route('')

      route.all((err, req, res, next) => {
        // this should not execute
        throw new Error('should not be called')
      })

      route.dispatch(req, {}, done)
    })
  })
})
