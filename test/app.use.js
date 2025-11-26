'use strict'

const after = require('after')
const assert = require('node:assert')
const express = require('../')
const request = require('supertest')

describe('app', () => {
  it('should emit "mount" when mounted', (done) => {
    const blog = express()
    const app = express()

    blog.on('mount', (arg) => {
      assert.strictEqual(arg, app)
      done()
    })

    app.use(blog)
  })

  describe('.use(app)', () => {
    it('should mount the app', (done) => {
      const blog = express()
      const app = express()

      blog.get('/blog', (req, res) => {
        res.end('blog')
      })

      app.use(blog)

      request(app)
        .get('/blog')
        .expect('blog', done)
    })

    it('should support mount-points', (done) => {
      const blog = express()
      const forum = express()
      const app = express()
      const cb = after(2, done)

      blog.get('/', (req, res) => {
        res.end('blog')
      })

      forum.get('/', (req, res) => {
        res.end('forum')
      })

      app.use('/blog', blog)
      app.use('/forum', forum)

      request(app)
        .get('/blog')
        .expect(200, 'blog', cb)

      request(app)
        .get('/forum')
        .expect(200, 'forum', cb)
    })

    it('should set the child\'s .parent', () => {
      const blog = express()
      const app = express()

      app.use('/blog', blog)
      assert.strictEqual(blog.parent, app)
    })

    it('should support dynamic routes', (done) => {
      const blog = express()
      const app = express()

      blog.get('/', (req, res) => {
        res.end('success')
      })

      app.use('/post/:article', blog)

      request(app)
        .get('/post/once-upon-a-time')
        .expect('success', done)
    })

    it('should support mounted app anywhere', (done) => {
      const cb = after(3, done)
      const blog = express()
      const other = express()
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      blog.get('/', (req, res) => {
        res.end('success')
      })

      blog.once('mount', (parent) => {
        assert.strictEqual(parent, app)
        cb()
      })
      other.once('mount', (parent) => {
        assert.strictEqual(parent, app)
        cb()
      })

      app.use('/post/:article', fn1, other, fn2, blog)

      request(app)
        .get('/post/once-upon-a-time')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('success', cb)
    })
  })

  describe('.use(middleware)', () => {
    it('should accept multiple arguments', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      app.use(fn1, fn2, (req, res) => {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      })

      request(app)
        .get('/')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })

    it('should invoke middleware for all requests', (done) => {
      const app = express()
      const cb = after(3, done)

      app.use((req, res) => {
        res.send('saw ' + req.method + ' ' + req.url)
      })

      request(app)
        .get('/')
        .expect(200, 'saw GET /', cb)

      request(app)
        .options('/')
        .expect(200, 'saw OPTIONS /', cb)

      request(app)
        .post('/foo')
        .expect(200, 'saw POST /foo', cb)
    })

    it('should accept array of middleware', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      function fn3 (req, res, next) {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      }

      app.use([fn1, fn2, fn3])

      request(app)
        .get('/')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })

    it('should accept multiple arrays of middleware', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      function fn3 (req, res, next) {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      }

      app.use([fn1, fn2], [fn3])

      request(app)
        .get('/')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })

    it('should accept nested arrays of middleware', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      function fn3 (req, res, next) {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      }

      app.use([[fn1], fn2], [fn3])

      request(app)
        .get('/')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })
  })

  describe('.use(path, middleware)', () => {
    it('should require middleware', () => {
      const app = express()
      assert.throws(() => { app.use('/') }, 'TypeError: app.use() requires a middleware function')
    })

    it('should reject string as middleware', () => {
      const app = express()
      assert.throws(() => { app.use('/', 'foo') }, /argument handler must be a function/)
    })

    it('should reject number as middleware', () => {
      const app = express()
      assert.throws(() => { app.use('/', 42) }, /argument handler must be a function/)
    })

    it('should reject null as middleware', () => {
      const app = express()
      assert.throws(() => { app.use('/', null) }, /argument handler must be a function/)
    })

    it('should reject Date as middleware', () => {
      const app = express()
      assert.throws(() => { app.use('/', new Date()) }, /argument handler must be a function/)
    })

    it('should strip path from req.url', (done) => {
      const app = express()

      app.use('/foo', (req, res) => {
        res.send('saw ' + req.method + ' ' + req.url)
      })

      request(app)
        .get('/foo/bar')
        .expect(200, 'saw GET /bar', done)
    })

    it('should accept multiple arguments', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      app.use('/foo', fn1, fn2, (req, res) => {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      })

      request(app)
        .get('/foo')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })

    it('should invoke middleware for all requests starting with path', (done) => {
      const app = express()
      const cb = after(3, done)

      app.use('/foo', (req, res) => {
        res.send('saw ' + req.method + ' ' + req.url)
      })

      request(app)
        .get('/')
        .expect(404, cb)

      request(app)
        .post('/foo')
        .expect(200, 'saw POST /', cb)

      request(app)
        .post('/foo/bar')
        .expect(200, 'saw POST /bar', cb)
    })

    it('should work if path has trailing slash', (done) => {
      const app = express()
      const cb = after(3, done)

      app.use('/foo/', (req, res) => {
        res.send('saw ' + req.method + ' ' + req.url)
      })

      request(app)
        .get('/')
        .expect(404, cb)

      request(app)
        .post('/foo')
        .expect(200, 'saw POST /', cb)

      request(app)
        .post('/foo/bar')
        .expect(200, 'saw POST /bar', cb)
    })

    it('should accept array of middleware', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      function fn3 (req, res, next) {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      }

      app.use('/foo', [fn1, fn2, fn3])

      request(app)
        .get('/foo')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })

    it('should accept multiple arrays of middleware', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      function fn3 (req, res, next) {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      }

      app.use('/foo', [fn1, fn2], [fn3])

      request(app)
        .get('/foo')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })

    it('should accept nested arrays of middleware', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      function fn3 (req, res, next) {
        res.setHeader('x-fn-3', 'hit')
        res.end()
      }

      app.use('/foo', [fn1, [fn2]], [fn3])

      request(app)
        .get('/foo')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, done)
    })

    it('should support array of paths', (done) => {
      const app = express()
      const cb = after(3, done)

      app.use(['/foo/', '/bar'], (req, res) => {
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl)
      })

      request(app)
        .get('/')
        .expect(404, cb)

      request(app)
        .get('/foo')
        .expect(200, 'saw GET / through /foo', cb)

      request(app)
        .get('/bar')
        .expect(200, 'saw GET / through /bar', cb)
    })

    it('should support array of paths with middleware array', (done) => {
      const app = express()
      const cb = after(2, done)

      function fn1 (req, res, next) {
        res.setHeader('x-fn-1', 'hit')
        next()
      }

      function fn2 (req, res, next) {
        res.setHeader('x-fn-2', 'hit')
        next()
      }

      function fn3 (req, res, next) {
        res.setHeader('x-fn-3', 'hit')
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl)
      }

      app.use(['/foo/', '/bar'], [[fn1], fn2], [fn3])

      request(app)
        .get('/foo')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, 'saw GET / through /foo', cb)

      request(app)
        .get('/bar')
        .expect('x-fn-1', 'hit')
        .expect('x-fn-2', 'hit')
        .expect('x-fn-3', 'hit')
        .expect(200, 'saw GET / through /bar', cb)
    })

    it('should support regexp path', (done) => {
      const app = express()
      const cb = after(4, done)

      app.use(/^\/[a-z]oo/, (req, res) => {
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl)
      })

      request(app)
        .get('/')
        .expect(404, cb)

      request(app)
        .get('/foo')
        .expect(200, 'saw GET / through /foo', cb)

      request(app)
        .get('/zoo/bear')
        .expect(200, 'saw GET /bear through /zoo/bear', cb)

      request(app)
        .get('/get/zoo')
        .expect(404, cb)
    })

    it('should support empty string path', (done) => {
      const app = express()

      app.use('', (req, res) => {
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl)
      })

      request(app)
        .get('/')
        .expect(200, 'saw GET / through /', done)
    })
  })
})
