'use strict'

const after = require('after')
const assert = require('node:assert')
const { AsyncLocalStorage } = require('node:async_hooks')
const { Buffer } = require('node:buffer')

const express = require('../')
const request = require('supertest')
const onFinished = require('on-finished')
const path = require('node:path')
const fixtures = path.join(__dirname, 'fixtures')
const utils = require('./support/utils')

describe('res', () => {
  describe('.sendFile(path)', () => {
    it('should error missing path', (done) => {
      const app = createApp()

      request(app)
        .get('/')
        .expect(500, /path.*required/, done)
    })

    it('should error for non-string path', (done) => {
      const app = createApp(42)

      request(app)
        .get('/')
        .expect(500, /TypeError: path must be a string to res.sendFile/, done)
    })

    it('should error for non-absolute path', (done) => {
      const app = createApp('name.txt')

      request(app)
        .get('/')
        .expect(500, /TypeError: path must be absolute/, done)
    })

    it('should transfer a file', (done) => {
      const app = createApp(path.resolve(fixtures, 'name.txt'))

      request(app)
        .get('/')
        .expect(200, 'tobi', done)
    })

    it('should transfer a file with special characters in string', (done) => {
      const app = createApp(path.resolve(fixtures, '% of dogs.txt'))

      request(app)
        .get('/')
        .expect(200, '20%', done)
    })

    it('should include ETag', (done) => {
      const app = createApp(path.resolve(fixtures, 'name.txt'))

      request(app)
        .get('/')
        .expect('ETag', /^(?:W\/)?"[^"]+"$/)
        .expect(200, 'tobi', done)
    })

    it('should 304 when ETag matches', (done) => {
      const app = createApp(path.resolve(fixtures, 'name.txt'))

      request(app)
        .get('/')
        .expect('ETag', /^(?:W\/)?"[^"]+"$/)
        .expect(200, 'tobi', (err, res) => {
          if (err) return done(err)
          const etag = res.headers.etag
          request(app)
            .get('/')
            .set('If-None-Match', etag)
            .expect(304, done)
        })
    })

    it('should disable the ETag function if requested', (done) => {
      const app = createApp(path.resolve(fixtures, 'name.txt')).disable('etag')

      request(app)
        .get('/')
        .expect(handleHeaders)
        .expect(200, done)

      function handleHeaders (res) {
        assert(res.headers.etag === undefined)
      }
    })

    it('should 404 for directory', (done) => {
      const app = createApp(path.resolve(fixtures, 'blog'))

      request(app)
        .get('/')
        .expect(404, done)
    })

    it('should 404 when not found', (done) => {
      const app = createApp(path.resolve(fixtures, 'does-no-exist'))

      app.use((req, res) => {
        res.statusCode = 200
        res.send('no!')
      })

      request(app)
        .get('/')
        .expect(404, done)
    })

    it('should send cache-control by default', (done) => {
      const app = createApp(path.resolve(__dirname, 'fixtures/name.txt'))

      request(app)
        .get('/')
        .expect('Cache-Control', 'public, max-age=0')
        .expect(200, done)
    })

    it('should not serve dotfiles by default', (done) => {
      const app = createApp(path.resolve(__dirname, 'fixtures/.name'))

      request(app)
        .get('/')
        .expect(404, done)
    })

    it('should not override manual content-types', (done) => {
      const app = express()

      app.use((req, res) => {
        res.contentType('application/x-bogus')
        res.sendFile(path.resolve(fixtures, 'name.txt'))
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'application/x-bogus')
        .end(done)
    })

    it('should not error if the client aborts', (done) => {
      const app = express()
      const cb = after(2, done)
      let error = null

      app.use((req, res) => {
        setImmediate(() => {
          res.sendFile(path.resolve(fixtures, 'name.txt'))
          setTimeout(() => {
            cb(error)
          }, 10)
        })
        test.req.abort()
      })

      app.use((err, req, res, next) => {
        error = err
        next(err)
      })

      const server = app.listen()
      const test = request(server).get('/')
      test.end((err) => {
        assert.ok(err)
        server.close(cb)
      })
    })
  })

  describe('.sendFile(path, fn)', () => {
    it('should invoke the callback when complete', (done) => {
      const cb = after(2, done)
      const app = createApp(path.resolve(fixtures, 'name.txt'), cb)

      request(app)
        .get('/')
        .expect(200, cb)
    })

    it('should invoke the callback when client aborts', (done) => {
      const cb = after(2, done)
      const app = express()

      app.use((req, res) => {
        setImmediate(() => {
          res.sendFile(path.resolve(fixtures, 'name.txt'), (err) => {
            assert.ok(err)
            assert.strictEqual(err.code, 'ECONNABORTED')
            cb()
          })
        })
        test.req.abort()
      })

      const server = app.listen()
      const test = request(server).get('/')
      test.end((err) => {
        assert.ok(err)
        server.close(cb)
      })
    })

    it('should invoke the callback when client already aborted', (done) => {
      const cb = after(2, done)
      const app = express()

      app.use((req, res) => {
        onFinished(res, () => {
          res.sendFile(path.resolve(fixtures, 'name.txt'), (err) => {
            assert.ok(err)
            assert.strictEqual(err.code, 'ECONNABORTED')
            cb()
          })
        })
        test.req.abort()
      })

      const server = app.listen()
      const test = request(server).get('/')
      test.end((err) => {
        assert.ok(err)
        server.close(cb)
      })
    })

    it('should invoke the callback without error when HEAD', (done) => {
      const app = express()
      const cb = after(2, done)

      app.use((req, res) => {
        res.sendFile(path.resolve(fixtures, 'name.txt'), cb)
      })

      request(app)
        .head('/')
        .expect(200, cb)
    })

    it('should invoke the callback without error when 304', (done) => {
      const app = express()
      const cb = after(3, done)

      app.use((req, res) => {
        res.sendFile(path.resolve(fixtures, 'name.txt'), cb)
      })

      request(app)
        .get('/')
        .expect('ETag', /^(?:W\/)?"[^"]+"$/)
        .expect(200, 'tobi', (err, res) => {
          if (err) return cb(err)
          const etag = res.headers.etag
          request(app)
            .get('/')
            .set('If-None-Match', etag)
            .expect(304, cb)
        })
    })

    it('should invoke the callback on 404', (done) => {
      const app = express()

      app.use((req, res) => {
        res.sendFile(path.resolve(fixtures, 'does-not-exist'), (err) => {
          res.send(err ? 'got ' + err.status + ' error' : 'no error')
        })
      })

      request(app)
        .get('/')
        .expect(200, 'got 404 error', done)
    })

    describe('async local storage', () => {
      it('should persist store', (done) => {
        const app = express()
        const cb = after(2, done)
        const store = { foo: 'bar' }

        app.use((req, res, next) => {
          req.asyncLocalStorage = new AsyncLocalStorage()
          req.asyncLocalStorage.run(store, next)
        })

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'name.txt'), (err) => {
            if (err) return cb(err)

            const local = req.asyncLocalStorage.getStore()

            assert.strictEqual(local.foo, 'bar')
            cb()
          })
        })

        request(app)
          .get('/')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(200, 'tobi', cb)
      })

      it('should persist store on error', (done) => {
        const app = express()
        const store = { foo: 'bar' }

        app.use((req, res, next) => {
          req.asyncLocalStorage = new AsyncLocalStorage()
          req.asyncLocalStorage.run(store, next)
        })

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'does-not-exist'), (err) => {
            const local = req.asyncLocalStorage.getStore()

            if (local) {
              res.setHeader('x-store-foo', String(local.foo))
            }

            res.send(err ? 'got ' + err.status + ' error' : 'no error')
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('x-store-foo', 'bar')
          .expect('got 404 error')
          .end(done)
      })
    })
  })

  describe('.sendFile(path, options)', () => {
    it('should pass options to send module', (done) => {
      request(createApp(path.resolve(fixtures, 'name.txt'), { start: 0, end: 1 }))
        .get('/')
        .expect(200, 'to', done)
    })

    describe('with "acceptRanges" option', () => {
      describe('when true', () => {
        it('should advertise byte range accepted', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Accept-Ranges', 'bytes')
            .expect('123456789')
            .end(done)
        })

        it('should respond to range request', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: true
            })
          })

          request(app)
            .get('/')
            .set('Range', 'bytes=0-4')
            .expect(206, '12345', done)
        })
      })

      describe('when false', () => {
        it('should not advertise accept-ranges', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Accept-Ranges'))
            .end(done)
        })

        it('should not honor range requests', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: false
            })
          })

          request(app)
            .get('/')
            .set('Range', 'bytes=0-4')
            .expect(200, '123456789', done)
        })
      })
    })

    describe('with "cacheControl" option', () => {
      describe('when true', () => {
        it('should send cache-control header', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              cacheControl: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=0')
            .end(done)
        })
      })

      describe('when false', () => {
        it('should not send cache-control header', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              cacheControl: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Cache-Control'))
            .end(done)
        })
      })
    })

    describe('with "dotfiles" option', () => {
      describe('when "allow"', () => {
        it('should allow dotfiles', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, '.name'), {
              dotfiles: 'allow'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldHaveBody(Buffer.from('tobi')))
            .end(done)
        })
      })

      describe('when "deny"', () => {
        it('should deny dotfiles', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, '.name'), {
              dotfiles: 'deny'
            })
          })

          request(app)
            .get('/')
            .expect(403)
            .expect(/Forbidden/)
            .end(done)
        })
      })

      describe('when "ignore"', () => {
        it('should ignore dotfiles', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, '.name'), {
              dotfiles: 'ignore'
            })
          })

          request(app)
            .get('/')
            .expect(404)
            .expect(/Not Found/)
            .end(done)
        })
      })
    })

    describe('with "headers" option', () => {
      it('should set headers on response', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            headers: {
              'X-Foo': 'Bar',
              'X-Bar': 'Foo'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('X-Foo', 'Bar')
          .expect('X-Bar', 'Foo')
          .end(done)
      })

      it('should use last header when duplicated', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            headers: {
              'X-Foo': 'Bar',
              'x-foo': 'bar'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('X-Foo', 'bar')
          .end(done)
      })

      it('should override Content-Type', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            headers: {
              'Content-Type': 'text/x-custom'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Type', 'text/x-custom')
          .end(done)
      })

      it('should not set headers on 404', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'does-not-exist'), {
            headers: {
              'X-Foo': 'Bar'
            }
          })
        })

        request(app)
          .get('/')
          .expect(404)
          .expect(utils.shouldNotHaveHeader('X-Foo'))
          .end(done)
      })
    })

    describe('with "immutable" option', () => {
      describe('when true', () => {
        it('should send cache-control header with immutable', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              immutable: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=0, immutable')
            .end(done)
        })
      })

      describe('when false', () => {
        it('should not send cache-control header with immutable', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              immutable: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=0')
            .end(done)
        })
      })
    })

    describe('with "lastModified" option', () => {
      describe('when true', () => {
        it('should send last-modified header', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldHaveHeader('Last-Modified'))
            .end(done)
        })

        it('should conditionally respond with if-modified-since', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: true
            })
          })

          request(app)
            .get('/')
            .set('If-Modified-Since', (new Date(Date.now() + 99999).toUTCString()))
            .expect(304, done)
        })
      })

      describe('when false', () => {
        it('should not have last-modified header', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Last-Modified'))
            .end(done)
        })

        it('should not honor if-modified-since', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: false
            })
          })

          request(app)
            .get('/')
            .set('If-Modified-Since', (new Date(Date.now() + 99999).toUTCString()))
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Last-Modified'))
            .end(done)
        })
      })
    })

    describe('with "maxAge" option', () => {
      it('should set cache-control max-age to milliseconds', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: 20000
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=20')
          .end(done)
      })

      it('should cap cache-control max-age to 1 year', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: 99999999999
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=31536000')
          .end(done)
      })

      it('should min cache-control max-age to 0', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: -20000
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=0')
          .end(done)
      })

      it('should floor cache-control max-age', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: 21911.23
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=21')
          .end(done)
      })

      describe('when cacheControl: false', () => {
        it('should not send cache-control', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              cacheControl: false,
              maxAge: 20000
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Cache-Control'))
            .end(done)
        })
      })

      describe('when string', () => {
        it('should accept plain number as milliseconds', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20000'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=20')
            .end(done)
        })

        it('should accept suffix "s" for seconds', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20s'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=20')
            .end(done)
        })

        it('should accept suffix "m" for minutes', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20m'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=1200')
            .end(done)
        })

        it('should accept suffix "d" for days', (done) => {
          const app = express()

          app.use((req, res) => {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20d'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=1728000')
            .end(done)
        })
      })
    })

    describe('with "root" option', () => {
      it('should allow relative path', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile('name.txt', {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(200, 'tobi', done)
      })

      it('should allow up within root', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile('fake/../name.txt', {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(200, 'tobi', done)
      })

      it('should reject up outside root', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile('..' + path.sep + path.relative(path.dirname(fixtures), path.join(fixtures, 'name.txt')), {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(403, done)
      })

      it('should reject reading outside root', (done) => {
        const app = express()

        app.use((req, res) => {
          res.sendFile('../name.txt', {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(403, done)
      })
    })
  })
})

function createApp (path, options, fn) {
  const app = express()

  app.use((req, res) => {
    res.sendFile(path, options, fn)
  })

  return app
}
