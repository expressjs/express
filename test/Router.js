'use strict'

const after = require('after')
const { Router } = require('../')
const { methods } = require('../lib/utils')
const assert = require('node:assert')

describe('Router', () => {
  it('should return a function with router methods', () => {
    const router = new Router()
    assert(typeof router === 'function')

    assert(typeof router.get === 'function')
    assert(typeof router.handle === 'function')
    assert(typeof router.use === 'function')
  })

  it('should support .use of other routers', (done) => {
    const router = new Router()
    const another = new Router()

    another.get('/bar', (req, res) => {
      res.end()
    })
    router.use('/foo', another)

    router.handle({ url: '/foo/bar', method: 'GET' }, { end: done }, () => { })
  })

  it('should support dynamic routes', (done) => {
    const router = new Router()
    const another = new Router()

    another.get('/:bar', (req, res) => {
      assert.strictEqual(req.params.bar, 'route')
      res.end()
    })
    router.use('/:foo', another)

    router.handle({ url: '/test/route', method: 'GET' }, { end: done }, () => { })
  })

  it('should handle blank URL', (done) => {
    const router = new Router()

    router.use((req, res) => {
      throw new Error('should not be called')
    })

    router.handle({ url: '', method: 'GET' }, {}, done)
  })

  it('should handle missing URL', (done) => {
    const router = new Router()

    router.use((req, res) => {
      throw new Error('should not be called')
    })

    router.handle({ method: 'GET' }, {}, done)
  })

  it('handle missing method', (done) => {
    let all = false
    const router = new Router()
    const route = router.route('/foo')
    let use = false

    route.post((req, res, next) => { next(new Error('should not run')) })
    route.all((req, res, next) => {
      all = true
      next()
    })
    route.get((req, res, next) => { next(new Error('should not run')) })

    router.get('/foo', (req, res, next) => { next(new Error('should not run')) })
    router.use((req, res, next) => {
      use = true
      next()
    })

    router.handle({ url: '/foo' }, {}, (err) => {
      if (err) return done(err)
      assert.ok(all)
      assert.ok(use)
      done()
    })
  })

  it('should not stack overflow with many registered routes', function (done) {
    this.timeout(5000) // long-running test

    const handler = function (req, res) { res.end(new Error('wrong handler')) }
    const router = new Router()

    for (let i = 0; i < 6000; i++) {
      router.get('/thing' + i, handler)
    }

    router.get('/', (req, res) => {
      res.end()
    })

    router.handle({ url: '/', method: 'GET' }, { end: done }, () => { })
  })

  it('should not stack overflow with a large sync route stack', function (done) {
    this.timeout(5000) // long-running test

    const router = new Router()

    router.get('/foo', (req, res, next) => {
      req.counter = 0
      next()
    })

    for (let i = 0; i < 6000; i++) {
      router.get('/foo', (req, res, next) => {
        req.counter++
        next()
      })
    }

    router.get('/foo', (req, res) => {
      assert.strictEqual(req.counter, 6000)
      res.end()
    })

    router.handle({ url: '/foo', method: 'GET' }, { end: done }, (err) => {
      assert(!err, err)
    })
  })

  it('should not stack overflow with a large sync middleware stack', function (done) {
    this.timeout(5000) // long-running test

    const router = new Router()

    router.use((req, res, next) => {
      req.counter = 0
      next()
    })

    for (let i = 0; i < 6000; i++) {
      router.use((req, res, next) => {
        req.counter++
        next()
      })
    }

    router.use((req, res) => {
      assert.strictEqual(req.counter, 6000)
      res.end()
    })

    router.handle({ url: '/', method: 'GET' }, { end: done }, (err) => {
      assert(!err, err)
    })
  })

  describe('.handle', () => {
    it('should dispatch', (done) => {
      const router = new Router()

      router.route('/foo').get((req, res) => {
        res.send('foo')
      })

      const res = {
        send: function (val) {
          assert.strictEqual(val, 'foo')
          done()
        }
      }
      router.handle({ url: '/foo', method: 'GET' }, res, () => { })
    })
  })

  describe('.multiple callbacks', () => {
    it('should throw if a callback is null', () => {
      assert.throws(() => {
        const router = new Router()
        router.route('/foo').all(null)
      })
    })

    it('should throw if a callback is undefined', () => {
      assert.throws(() => {
        const router = new Router()
        router.route('/foo').all(undefined)
      })
    })

    it('should throw if a callback is not a function', () => {
      assert.throws(() => {
        const router = new Router()
        router.route('/foo').all('not a function')
      })
    })

    it('should not throw if all callbacks are functions', () => {
      const router = new Router()
      router.route('/foo').all(() => { }).all(() => { })
    })
  })

  describe('error', () => {
    it('should skip non error middleware', (done) => {
      const router = new Router()

      router.get('/foo', (req, res, next) => {
        next(new Error('foo'))
      })

      router.get('/bar', (req, res, next) => {
        next(new Error('bar'))
      })

      router.use((req, res, next) => {
        assert(false)
      })

      router.use((err, req, res, next) => {
        assert.equal(err.message, 'foo')
        done()
      })

      router.handle({ url: '/foo', method: 'GET' }, {}, done)
    })

    it('should handle throwing inside routes with params', (done) => {
      const router = new Router()

      router.get('/foo/:id', () => {
        throw new Error('foo')
      })

      router.use((req, res, next) => {
        assert(false)
      })

      router.use((err, req, res, next) => {
        assert.equal(err.message, 'foo')
        done()
      })

      router.handle({ url: '/foo/2', method: 'GET' }, {}, () => { })
    })

    it('should handle throwing in handler after async param', (done) => {
      const router = new Router()

      router.param('user', (req, res, next, val) => {
        process.nextTick(() => {
          req.user = val
          next()
        })
      })

      router.use('/:user', (req, res, next) => {
        throw new Error('oh no!')
      })

      router.use((err, req, res, next) => {
        assert.equal(err.message, 'oh no!')
        done()
      })

      router.handle({ url: '/bob', method: 'GET' }, {}, () => { })
    })

    it('should handle throwing inside error handlers', (done) => {
      const router = new Router()

      router.use((req, res, next) => {
        throw new Error('boom!')
      })

      router.use((err, req, res, next) => {
        throw new Error('oops')
      })

      router.use((err, req, res, next) => {
        assert.equal(err.message, 'oops')
        done()
      })

      router.handle({ url: '/', method: 'GET' }, {}, done)
    })
  })

  describe('FQDN', () => {
    it('should not obscure FQDNs', (done) => {
      const request = { hit: 0, url: 'http://example.com/foo', method: 'GET' }
      const router = new Router()

      router.use((req, res, next) => {
        assert.equal(req.hit++, 0)
        assert.equal(req.url, 'http://example.com/foo')
        next()
      })

      router.handle(request, {}, (err) => {
        if (err) return done(err)
        assert.equal(request.hit, 1)
        done()
      })
    })

    it('should ignore FQDN in search', (done) => {
      const request = { hit: 0, url: '/proxy?url=http://example.com/blog/post/1', method: 'GET' }
      const router = new Router()

      router.use('/proxy', (req, res, next) => {
        assert.equal(req.hit++, 0)
        assert.equal(req.url, '/?url=http://example.com/blog/post/1')
        next()
      })

      router.handle(request, {}, (err) => {
        if (err) return done(err)
        assert.equal(request.hit, 1)
        done()
      })
    })

    it('should ignore FQDN in path', (done) => {
      const request = { hit: 0, url: '/proxy/http://example.com/blog/post/1', method: 'GET' }
      const router = new Router()

      router.use('/proxy', (req, res, next) => {
        assert.equal(req.hit++, 0)
        assert.equal(req.url, '/http://example.com/blog/post/1')
        next()
      })

      router.handle(request, {}, (err) => {
        if (err) return done(err)
        assert.equal(request.hit, 1)
        done()
      })
    })

    it('should adjust FQDN req.url', (done) => {
      const request = { hit: 0, url: 'http://example.com/blog/post/1', method: 'GET' }
      const router = new Router()

      router.use('/blog', (req, res, next) => {
        assert.equal(req.hit++, 0)
        assert.equal(req.url, 'http://example.com/post/1')
        next()
      })

      router.handle(request, {}, (err) => {
        if (err) return done(err)
        assert.equal(request.hit, 1)
        done()
      })
    })

    it('should adjust FQDN req.url with multiple handlers', (done) => {
      const request = { hit: 0, url: 'http://example.com/blog/post/1', method: 'GET' }
      const router = new Router()

      router.use((req, res, next) => {
        assert.equal(req.hit++, 0)
        assert.equal(req.url, 'http://example.com/blog/post/1')
        next()
      })

      router.use('/blog', (req, res, next) => {
        assert.equal(req.hit++, 1)
        assert.equal(req.url, 'http://example.com/post/1')
        next()
      })

      router.handle(request, {}, (err) => {
        if (err) return done(err)
        assert.equal(request.hit, 2)
        done()
      })
    })

    it('should adjust FQDN req.url with multiple routed handlers', (done) => {
      const request = { hit: 0, url: 'http://example.com/blog/post/1', method: 'GET' }
      const router = new Router()

      router.use('/blog', (req, res, next) => {
        assert.equal(req.hit++, 0)
        assert.equal(req.url, 'http://example.com/post/1')
        next()
      })

      router.use('/blog', (req, res, next) => {
        assert.equal(req.hit++, 1)
        assert.equal(req.url, 'http://example.com/post/1')
        next()
      })

      router.use((req, res, next) => {
        assert.equal(req.hit++, 2)
        assert.equal(req.url, 'http://example.com/blog/post/1')
        next()
      })

      router.handle(request, {}, (err) => {
        if (err) return done(err)
        assert.equal(request.hit, 3)
        done()
      })
    })
  })

  describe('.all', () => {
    it('should support using .all to capture all http verbs', (done) => {
      const router = new Router()

      let count = 0
      router.all('/foo', () => { count++ })

      const url = '/foo?bar=baz'

      methods.forEach((method) => {
        router.handle({ url, method }, {}, () => { })
      })

      assert.equal(count, methods.length)
      done()
    })
  })

  describe('.use', () => {
    it('should require middleware', () => {
      const router = new Router()
      assert.throws(() => { router.use('/') }, /argument handler is required/)
    })

    it('should reject string as middleware', () => {
      const router = new Router()
      assert.throws(() => { router.use('/', 'foo') }, /argument handler must be a function/)
    })

    it('should reject number as middleware', () => {
      const router = new Router()
      assert.throws(() => { router.use('/', 42) }, /argument handler must be a function/)
    })

    it('should reject null as middleware', () => {
      const router = new Router()
      assert.throws(() => { router.use('/', null) }, /argument handler must be a function/)
    })

    it('should reject Date as middleware', () => {
      const router = new Router()
      assert.throws(() => { router.use('/', new Date()) }, /argument handler must be a function/)
    })

    it('should be called for any URL', (done) => {
      const cb = after(4, done)
      const router = new Router()

      function no () {
        throw new Error('should not be called')
      }

      router.use((req, res) => {
        res.end()
      })

      router.handle({ url: '/', method: 'GET' }, { end: cb }, no)
      router.handle({ url: '/foo', method: 'GET' }, { end: cb }, no)
      router.handle({ url: 'foo', method: 'GET' }, { end: cb }, no)
      router.handle({ url: '*', method: 'GET' }, { end: cb }, no)
    })

    it('should accept array of middleware', (done) => {
      let count = 0
      const router = new Router()

      function fn1 (req, res, next) {
        assert.equal(++count, 1)
        next()
      }

      function fn2 (req, res, next) {
        assert.equal(++count, 2)
        next()
      }

      router.use([fn1, fn2], (req, res) => {
        assert.equal(++count, 3)
        done()
      })

      router.handle({ url: '/foo', method: 'GET' }, {}, () => { })
    })
  })

  describe('.param', () => {
    it('should require function', () => {
      const router = new Router()
      assert.throws(router.param.bind(router, 'id'), /argument fn is required/)
    })

    it('should reject non-function', () => {
      const router = new Router()
      assert.throws(router.param.bind(router, 'id', 42), /argument fn must be a function/)
    })

    it('should call param function when routing VERBS', (done) => {
      const router = new Router()

      router.param('id', (req, res, next, id) => {
        assert.equal(id, '123')
        next()
      })

      router.get('/foo/:id/bar', (req, res, next) => {
        assert.equal(req.params.id, '123')
        next()
      })

      router.handle({ url: '/foo/123/bar', method: 'get' }, {}, done)
    })

    it('should call param function when routing middleware', (done) => {
      const router = new Router()

      router.param('id', (req, res, next, id) => {
        assert.equal(id, '123')
        next()
      })

      router.use('/foo/:id/bar', (req, res, next) => {
        assert.equal(req.params.id, '123')
        assert.equal(req.url, '/baz')
        next()
      })

      router.handle({ url: '/foo/123/bar/baz', method: 'get' }, {}, done)
    })

    it('should only call once per request', (done) => {
      let count = 0
      const req = { url: '/foo/bob/bar', method: 'get' }
      const router = new Router()
      const sub = new Router()

      sub.get('/bar', (req, res, next) => {
        next()
      })

      router.param('user', (req, res, next, user) => {
        count++
        req.user = user
        next()
      })

      router.use('/foo/:user/', new Router())
      router.use('/foo/:user/', sub)

      router.handle(req, {}, (err) => {
        if (err) return done(err)
        assert.equal(count, 1)
        assert.equal(req.user, 'bob')
        done()
      })
    })

    it('should call when values differ', (done) => {
      let count = 0
      const req = { url: '/foo/bob/bar', method: 'get' }
      const router = new Router()
      const sub = new Router()

      sub.get('/bar', (req, res, next) => {
        next()
      })

      router.param('user', (req, res, next, user) => {
        count++
        req.user = user
        next()
      })

      router.use('/foo/:user/', new Router())
      router.use('/:user/bob/', sub)

      router.handle(req, {}, (err) => {
        if (err) return done(err)
        assert.equal(count, 2)
        assert.equal(req.user, 'foo')
        done()
      })
    })
  })

  describe('parallel requests', () => {
    it('should not mix requests', (done) => {
      const req1 = { url: '/foo/50/bar', method: 'get' }
      const req2 = { url: '/foo/10/bar', method: 'get' }
      const router = new Router()
      const sub = new Router()
      const cb = after(2, done)

      sub.get('/bar', (req, res, next) => {
        next()
      })

      router.param('ms', (req, res, next, ms) => {
        ms = parseInt(ms, 10)
        req.ms = ms
        setTimeout(next, ms)
      })

      router.use('/foo/:ms/', new Router())
      router.use('/foo/:ms/', sub)

      router.handle(req1, {}, (err) => {
        assert.ifError(err)
        assert.equal(req1.ms, 50)
        assert.equal(req1.originalUrl, '/foo/50/bar')
        cb()
      })

      router.handle(req2, {}, (err) => {
        assert.ifError(err)
        assert.equal(req2.ms, 10)
        assert.equal(req2.originalUrl, '/foo/10/bar')
        cb()
      })
    })
  })
})
