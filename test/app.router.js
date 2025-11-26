'use strict'

const after = require('after')
const express = require('../')
const request = require('supertest')
const assert = require('node:assert')
const { methods } = require('../lib/utils')

const { shouldSkipQuery } = require('./support/utils')

describe('app.router', () => {
  it('should restore req.params after leaving router', (done) => {
    const app = express()
    const router = new express.Router()

    function handler1 (req, res, next) {
      res.setHeader('x-user-id', String(req.params.id))
      next()
    }

    function handler2 (req, res) {
      res.send(req.params.id)
    }

    router.use((req, res, next) => {
      res.setHeader('x-router', String(req.params.id))
      next()
    })

    app.get('/user/:id', handler1, router, handler2)

    request(app)
      .get('/user/1')
      .expect('x-router', 'undefined')
      .expect('x-user-id', '1')
      .expect(200, '1', done)
  })

  describe('methods', () => {
    methods.forEach((method) => {
      if (method === 'connect') return

      it('should include ' + method.toUpperCase(), function (done) {
        if (method === 'query' && shouldSkipQuery(process.versions.node)) {
          this.skip()
        }
        const app = express()

        app[method]('/foo', (req, res) => {
          res.send(method)
        })

        request(app)[method]('/foo')
          .expect(200, done)
      })

      it('should reject numbers for app.' + method, () => {
        const app = express()
        assert.throws(app[method].bind(app, '/', 3), /argument handler must be a function/)
      })
    })

    it('should re-route when method is altered', (done) => {
      const app = express()
      const cb = after(3, done)

      app.use((req, res, next) => {
        if (req.method !== 'POST') return next()
        req.method = 'DELETE'
        res.setHeader('X-Method-Altered', '1')
        next()
      })

      app.delete('/', (req, res) => {
        res.end('deleted everything')
      })

      request(app)
        .get('/')
        .expect(404, cb)

      request(app)
        .delete('/')
        .expect(200, 'deleted everything', cb)

      request(app)
        .post('/')
        .expect('X-Method-Altered', '1')
        .expect(200, 'deleted everything', cb)
    })
  })

  describe('decode params', () => {
    it('should decode correct params', (done) => {
      const app = express()

      app.get('/:name', (req, res) => {
        res.send(req.params.name)
      })

      request(app)
        .get('/foo%2Fbar')
        .expect('foo/bar', done)
    })

    it('should not accept params in malformed paths', (done) => {
      const app = express()

      app.get('/:name', (req, res) => {
        res.send(req.params.name)
      })

      request(app)
        .get('/%foobar')
        .expect(400, done)
    })

    it('should not decode spaces', (done) => {
      const app = express()

      app.get('/:name', (req, res) => {
        res.send(req.params.name)
      })

      request(app)
        .get('/foo+bar')
        .expect('foo+bar', done)
    })

    it('should work with unicode', (done) => {
      const app = express()

      app.get('/:name', (req, res) => {
        res.send(req.params.name)
      })

      request(app)
        .get('/%ce%b1')
        .expect('\u03b1', done)
    })
  })

  it('should be .use()able', (done) => {
    const app = express()

    const calls = []

    app.use((req, res, next) => {
      calls.push('before')
      next()
    })

    app.get('/', (req, res, next) => {
      calls.push('GET /')
      next()
    })

    app.use((req, res, next) => {
      calls.push('after')
      res.json(calls)
    })

    request(app)
      .get('/')
      .expect(200, ['before', 'GET /', 'after'], done)
  })

  describe('when given a regexp', () => {
    it('should match the pathname only', (done) => {
      const app = express()

      app.get(/^\/user\/[0-9]+$/, (req, res) => {
        res.end('user')
      })

      request(app)
        .get('/user/12?foo=bar')
        .expect('user', done)
    })

    it('should populate req.params with the captures', (done) => {
      const app = express()

      app.get(/^\/user\/([0-9]+)\/(view|edit)?$/, (req, res) => {
        const id = req.params[0]
        const op = req.params[1]
        res.end(op + 'ing user ' + id)
      })

      request(app)
        .get('/user/10/edit')
        .expect('editing user 10', done)
    })

    if (supportsRegexp('(?<foo>.*)')) {
      it('should populate req.params with named captures', (done) => {
        const app = express()
        // eslint-disable-next-line prefer-regex-literals
        const re = new RegExp('^/user/(?<userId>[0-9]+)/(view|edit)?$')

        app.get(re, (req, res) => {
          const id = req.params.userId
          const op = req.params[0]
          res.end(op + 'ing user ' + id)
        })

        request(app)
          .get('/user/10/edit')
          .expect('editing user 10', done)
      })
    }

    it('should ensure regexp matches path prefix', (done) => {
      const app = express()
      const p = []

      app.use(/\/api.*/, (req, res, next) => {
        p.push('a')
        next()
      })
      app.use(/api/, (req, res, next) => {
        p.push('b')
        next()
      })
      app.use(/\/test/, (req, res, next) => {
        p.push('c')
        next()
      })
      app.use((req, res) => {
        res.end()
      })

      request(app)
        .get('/test/api/1234')
        .expect(200, (err) => {
          if (err) return done(err)
          assert.deepEqual(p, ['c'])
          done()
        })
    })
  })

  describe('case sensitivity', () => {
    it('should be disabled by default', (done) => {
      const app = express()

      app.get('/user', (req, res) => {
        res.end('tj')
      })

      request(app)
        .get('/USER')
        .expect('tj', done)
    })

    describe('when "case sensitive routing" is enabled', () => {
      it('should match identical casing', (done) => {
        const app = express()

        app.enable('case sensitive routing')

        app.get('/uSer', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/uSer')
          .expect('tj', done)
      })

      it('should not match otherwise', (done) => {
        const app = express()

        app.enable('case sensitive routing')

        app.get('/uSer', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user')
          .expect(404, done)
      })
    })
  })

  describe('params', () => {
    it('should overwrite existing req.params by default', (done) => {
      const app = express()
      const router = new express.Router()

      router.get('/:action', (req, res) => {
        res.send(req.params)
      })

      app.use('/user/:user', router)

      request(app)
        .get('/user/1/get')
        .expect(200, '{"action":"get"}', done)
    })

    it('should allow merging existing req.params', (done) => {
      const app = express()
      const router = new express.Router({ mergeParams: true })

      router.get('/:action', (req, res) => {
        const keys = Object.keys(req.params).sort()
        res.send(keys.map((k) => [k, req.params[k]]))
      })

      app.use('/user/:user', router)

      request(app)
        .get('/user/tj/get')
        .expect(200, '[["action","get"],["user","tj"]]', done)
    })

    it('should use params from router', (done) => {
      const app = express()
      const router = new express.Router({ mergeParams: true })

      router.get('/:thing', (req, res) => {
        const keys = Object.keys(req.params).sort()
        res.send(keys.map((k) => [k, req.params[k]]))
      })

      app.use('/user/:thing', router)

      request(app)
        .get('/user/tj/get')
        .expect(200, '[["thing","get"]]', done)
    })

    it('should merge numeric indices req.params', (done) => {
      const app = express()
      const router = new express.Router({ mergeParams: true })

      router.get(/^\/(.*)\.(.*)/, (req, res) => {
        const keys = Object.keys(req.params).sort()
        res.send(keys.map((k) => [k, req.params[k]]))
      })

      app.use(/^\/user\/id:(\d+)/, router)

      request(app)
        .get('/user/id:10/profile.json')
        .expect(200, '[["0","10"],["1","profile"],["2","json"]]', done)
    })

    it('should merge numeric indices req.params when more in parent', (done) => {
      const app = express()
      const router = new express.Router({ mergeParams: true })

      router.get(/\/(.*)/, (req, res) => {
        const keys = Object.keys(req.params).sort()
        res.send(keys.map((k) => [k, req.params[k]]))
      })

      app.use(/^\/user\/id:(\d+)\/name:(\w+)/, router)

      request(app)
        .get('/user/id:10/name:tj/profile')
        .expect(200, '[["0","10"],["1","tj"],["2","profile"]]', done)
    })

    it('should merge numeric indices req.params when parent has same number', (done) => {
      const app = express()
      const router = new express.Router({ mergeParams: true })

      router.get(/\/name:(\w+)/, (req, res) => {
        const keys = Object.keys(req.params).sort()
        res.send(keys.map((k) => [k, req.params[k]]))
      })

      app.use(/\/user\/id:(\d+)/, router)

      request(app)
        .get('/user/id:10/name:tj')
        .expect(200, '[["0","10"],["1","tj"]]', done)
    })

    it('should ignore invalid incoming req.params', (done) => {
      const app = express()
      const router = new express.Router({ mergeParams: true })

      router.get('/:name', (req, res) => {
        const keys = Object.keys(req.params).sort()
        res.send(keys.map((k) => [k, req.params[k]]))
      })

      app.use('/user/', (req, res, next) => {
        req.params = 3 // wat?
        router(req, res, next)
      })

      request(app)
        .get('/user/tj')
        .expect(200, '[["name","tj"]]', done)
    })

    it('should restore req.params', (done) => {
      const app = express()
      const router = new express.Router({ mergeParams: true })

      router.get(/\/user:(\w+)\//, (req, res, next) => {
        next()
      })

      app.use(/\/user\/id:(\d+)/, (req, res, next) => {
        router(req, res, (err) => {
          const keys = Object.keys(req.params).sort()
          res.send(keys.map((k) => [k, req.params[k]]))
        })
      })

      request(app)
        .get('/user/id:42/user:tj/profile')
        .expect(200, '[["0","42"]]', done)
    })
  })

  describe('trailing slashes', () => {
    it('should be optional by default', (done) => {
      const app = express()

      app.get('/user', (req, res) => {
        res.end('tj')
      })

      request(app)
        .get('/user/')
        .expect('tj', done)
    })

    describe('when "strict routing" is enabled', () => {
      it('should match trailing slashes', (done) => {
        const app = express()

        app.enable('strict routing')

        app.get('/user/', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user/')
          .expect('tj', done)
      })

      it('should pass-though middleware', (done) => {
        const app = express()

        app.enable('strict routing')

        app.use((req, res, next) => {
          res.setHeader('x-middleware', 'true')
          next()
        })

        app.get('/user/', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user/')
          .expect('x-middleware', 'true')
          .expect(200, 'tj', done)
      })

      it('should pass-though mounted middleware', (done) => {
        const app = express()

        app.enable('strict routing')

        app.use('/user/', (req, res, next) => {
          res.setHeader('x-middleware', 'true')
          next()
        })

        app.get('/user/test/', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user/test/')
          .expect('x-middleware', 'true')
          .expect(200, 'tj', done)
      })

      it('should match no slashes', (done) => {
        const app = express()

        app.enable('strict routing')

        app.get('/user', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user')
          .expect('tj', done)
      })

      it('should match middleware when omitting the trailing slash', (done) => {
        const app = express()

        app.enable('strict routing')

        app.use('/user/', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user')
          .expect(200, 'tj', done)
      })

      it('should match middleware', (done) => {
        const app = express()

        app.enable('strict routing')

        app.use('/user', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user')
          .expect(200, 'tj', done)
      })

      it('should match middleware when adding the trailing slash', (done) => {
        const app = express()

        app.enable('strict routing')

        app.use('/user', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user/')
          .expect(200, 'tj', done)
      })

      it('should fail when omitting the trailing slash', (done) => {
        const app = express()

        app.enable('strict routing')

        app.get('/user/', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user')
          .expect(404, done)
      })

      it('should fail when adding the trailing slash', (done) => {
        const app = express()

        app.enable('strict routing')

        app.get('/user', (req, res) => {
          res.end('tj')
        })

        request(app)
          .get('/user/')
          .expect(404, done)
      })
    })
  })

  it('should allow literal "."', (done) => {
    const app = express()

    app.get('/api/users/:from..:to', (req, res) => {
      const from = req.params.from
      const to = req.params.to

      res.end('users from ' + from + ' to ' + to)
    })

    request(app)
      .get('/api/users/1..50')
      .expect('users from 1 to 50', done)
  })

  describe(':name', () => {
    it('should denote a capture group', (done) => {
      const app = express()

      app.get('/user/:user', (req, res) => {
        res.end(req.params.user)
      })

      request(app)
        .get('/user/tj')
        .expect('tj', done)
    })

    it('should match a single segment only', (done) => {
      const app = express()

      app.get('/user/:user', (req, res) => {
        res.end(req.params.user)
      })

      request(app)
        .get('/user/tj/edit')
        .expect(404, done)
    })

    it('should allow several capture groups', (done) => {
      const app = express()

      app.get('/user/:user/:op', (req, res) => {
        res.end(req.params.op + 'ing ' + req.params.user)
      })

      request(app)
        .get('/user/tj/edit')
        .expect('editing tj', done)
    })

    it('should work following a partial capture group', (done) => {
      const app = express()
      const cb = after(2, done)

      app.get('/user{s}/:user/:op', (req, res) => {
        res.end(req.params.op + 'ing ' + req.params.user + (req.url.startsWith('/users') ? ' (old)' : ''))
      })

      request(app)
        .get('/user/tj/edit')
        .expect('editing tj', cb)

      request(app)
        .get('/users/tj/edit')
        .expect('editing tj (old)', cb)
    })

    it('should work inside literal parenthesis', (done) => {
      const app = express()

      app.get('/:user\\(:op\\)', (req, res) => {
        res.end(req.params.op + 'ing ' + req.params.user)
      })

      request(app)
        .get('/tj(edit)')
        .expect('editing tj', done)
    })

    it('should work in array of paths', (done) => {
      const app = express()
      const cb = after(2, done)

      app.get(['/user/:user/poke', '/user/:user/pokes'], (req, res) => {
        res.end('poking ' + req.params.user)
      })

      request(app)
        .get('/user/tj/poke')
        .expect('poking tj', cb)

      request(app)
        .get('/user/tj/pokes')
        .expect('poking tj', cb)
    })
  })

  describe(':name?', () => {
    it('should denote an optional capture group', (done) => {
      const app = express()

      app.get('/user/:user{/:op}', (req, res) => {
        const op = req.params.op || 'view'
        res.end(op + 'ing ' + req.params.user)
      })

      request(app)
        .get('/user/tj')
        .expect('viewing tj', done)
    })

    it('should populate the capture group', (done) => {
      const app = express()

      app.get('/user/:user{/:op}', (req, res) => {
        const op = req.params.op || 'view'
        res.end(op + 'ing ' + req.params.user)
      })

      request(app)
        .get('/user/tj/edit')
        .expect('editing tj', done)
    })
  })

  describe(':name*', () => {
    it('should match one segment', (done) => {
      const app = express()

      app.get('/user/*user', (req, res) => {
        res.end(req.params.user[0])
      })

      request(app)
        .get('/user/122')
        .expect('122', done)
    })

    it('should match many segments', (done) => {
      const app = express()

      app.get('/user/*user', (req, res) => {
        res.end(req.params.user.join('/'))
      })

      request(app)
        .get('/user/1/2/3/4')
        .expect('1/2/3/4', done)
    })

    it('should match zero segments', (done) => {
      const app = express()

      app.get('/user{/*user}', (req, res) => {
        res.end(req.params.user)
      })

      request(app)
        .get('/user')
        .expect('', done)
    })
  })

  describe(':name+', () => {
    it('should match one segment', (done) => {
      const app = express()

      app.get('/user/*user', (req, res) => {
        res.end(req.params.user[0])
      })

      request(app)
        .get('/user/122')
        .expect(200, '122', done)
    })

    it('should match many segments', (done) => {
      const app = express()

      app.get('/user/*user', (req, res) => {
        res.end(req.params.user.join('/'))
      })

      request(app)
        .get('/user/1/2/3/4')
        .expect(200, '1/2/3/4', done)
    })

    it('should not match zero segments', (done) => {
      const app = express()

      app.get('/user/*user', (req, res) => {
        res.end(req.params.user)
      })

      request(app)
        .get('/user')
        .expect(404, done)
    })
  })

  describe('.:name', () => {
    it('should denote a format', (done) => {
      const app = express()
      const cb = after(2, done)

      app.get('/:name.:format', (req, res) => {
        res.end(req.params.name + ' as ' + req.params.format)
      })

      request(app)
        .get('/foo.json')
        .expect(200, 'foo as json', cb)

      request(app)
        .get('/foo')
        .expect(404, cb)
    })
  })

  describe('.:name?', () => {
    it('should denote an optional format', (done) => {
      const app = express()
      const cb = after(2, done)

      app.get('/:name{.:format}', (req, res) => {
        res.end(req.params.name + ' as ' + (req.params.format || 'html'))
      })

      request(app)
        .get('/foo')
        .expect(200, 'foo as html', cb)

      request(app)
        .get('/foo.json')
        .expect(200, 'foo as json', cb)
    })
  })

  describe('when next() is called', () => {
    it('should continue lookup', (done) => {
      const app = express()
      const calls = []

      app.get('/foo{/:bar}', (req, res, next) => {
        calls.push('/foo/:bar?')
        next()
      })

      app.get('/bar', () => {
        assert(0)
      })

      app.get('/foo', (req, res, next) => {
        calls.push('/foo')
        next()
      })

      app.get('/foo', (req, res) => {
        calls.push('/foo 2')
        res.json(calls)
      })

      request(app)
        .get('/foo')
        .expect(200, ['/foo/:bar?', '/foo', '/foo 2'], done)
    })
  })

  describe('when next("route") is called', () => {
    it('should jump to next route', (done) => {
      const app = express()

      function fn (req, res, next) {
        res.set('X-Hit', '1')
        next('route')
      }

      app.get('/foo', fn, (req, res) => {
        res.end('failure')
      })

      app.get('/foo', (req, res) => {
        res.end('success')
      })

      request(app)
        .get('/foo')
        .expect('X-Hit', '1')
        .expect(200, 'success', done)
    })
  })

  describe('when next("router") is called', () => {
    it('should jump out of router', (done) => {
      const app = express()
      const router = express.Router()

      function fn (req, res, next) {
        res.set('X-Hit', '1')
        next('router')
      }

      router.get('/foo', fn, (req, res) => {
        res.end('failure')
      })

      router.get('/foo', (req, res) => {
        res.end('failure')
      })

      app.use(router)

      app.get('/foo', (req, res) => {
        res.end('success')
      })

      request(app)
        .get('/foo')
        .expect('X-Hit', '1')
        .expect(200, 'success', done)
    })
  })

  describe('when next(err) is called', () => {
    it('should break out of app.router', (done) => {
      const app = express()
      const calls = []

      app.get('/foo{/:bar}', (req, res, next) => {
        calls.push('/foo/:bar?')
        next()
      })

      app.get('/bar', () => {
        assert(0)
      })

      app.get('/foo', (req, res, next) => {
        calls.push('/foo')
        next(new Error('fail'))
      })

      app.get('/foo', () => {
        assert(0)
      })

      app.use((err, req, res, next) => {
        res.json({
          calls,
          error: err.message
        })
      })

      request(app)
        .get('/foo')
        .expect(200, { calls: ['/foo/:bar?', '/foo'], error: 'fail' }, done)
    })

    it('should call handler in same route, if exists', (done) => {
      const app = express()

      function fn1 (req, res, next) {
        next(new Error('boom!'))
      }

      function fn2 (req, res, next) {
        res.send('foo here')
      }

      function fn3 (err, req, res, next) {
        res.send('route go ' + err.message)
      }

      app.get('/foo', fn1, fn2, fn3)

      app.use((err, req, res, next) => {
        res.end('error!')
      })

      request(app)
        .get('/foo')
        .expect('route go boom!', done)
    })
  })

  describe('promise support', () => {
    it('should pass rejected promise value', (done) => {
      const app = express()
      const router = new express.Router()

      router.use((req, res, next) => Promise.reject(new Error('boom!')))

      router.use((err, req, res, next) => {
        res.send('saw ' + err.name + ': ' + err.message)
      })

      app.use(router)

      request(app)
        .get('/')
        .expect(200, 'saw Error: boom!', done)
    })

    it('should pass rejected promise without value', (done) => {
      const app = express()
      const router = new express.Router()

      router.use((req, res, next) =>
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject()
      )

      router.use((err, req, res, next) => {
        res.send('saw ' + err.name + ': ' + err.message)
      })

      app.use(router)

      request(app)
        .get('/')
        .expect(200, 'saw Error: Rejected promise', done)
    })

    it('should ignore resolved promise', (done) => {
      const app = express()
      const router = new express.Router()

      router.use((req, res, next) => {
        res.send('saw GET /foo')
        return Promise.resolve('foo')
      })

      router.use(() => {
        done(new Error('Unexpected middleware invoke'))
      })

      app.use(router)

      request(app)
        .get('/foo')
        .expect(200, 'saw GET /foo', done)
    })

    describe('error handling', () => {
      it('should pass rejected promise value', (done) => {
        const app = express()
        const router = new express.Router()

        router.use((req, res, next) => Promise.reject(new Error('boom!')))

        router.use((err, req, res, next) => Promise.reject(new Error('caught: ' + err.message)))

        router.use((err, req, res, next) => {
          res.send('saw ' + err.name + ': ' + err.message)
        })

        app.use(router)

        request(app)
          .get('/')
          .expect(200, 'saw Error: caught: boom!', done)
      })

      it('should pass rejected promise without value', (done) => {
        const app = express()
        const router = new express.Router()

        router.use((req, res, next) =>
          // eslint-disable-next-line prefer-promise-reject-errors
          Promise.reject()
        )

        router.use((err, req, res, next) => Promise.reject(new Error('caught: ' + err.message)))

        router.use((err, req, res, next) => {
          res.send('saw ' + err.name + ': ' + err.message)
        })

        app.use(router)

        request(app)
          .get('/')
          .expect(200, 'saw Error: caught: Rejected promise', done)
      })

      it('should ignore resolved promise', (done) => {
        const app = express()
        const router = new express.Router()

        router.use((req, res, next) => Promise.reject(new Error('boom!')))

        router.use((err, req, res, next) => {
          res.send('saw ' + err.name + ': ' + err.message)
          return Promise.resolve('foo')
        })

        router.use(() => {
          done(new Error('Unexpected middleware invoke'))
        })

        app.use(router)

        request(app)
          .get('/foo')
          .expect(200, 'saw Error: boom!', done)
      })
    })
  })

  it('should allow rewriting of the url', (done) => {
    const app = express()

    app.get('/account/edit', (req, res, next) => {
      req.user = { id: 12 } // faux authenticated user
      req.url = '/user/' + req.user.id + '/edit'
      next()
    })

    app.get('/user/:id/edit', (req, res) => {
      res.send('editing user ' + req.params.id)
    })

    request(app)
      .get('/account/edit')
      .expect('editing user 12', done)
  })

  it('should run in order added', (done) => {
    const app = express()
    const path = []

    app.get('/*path', (req, res, next) => {
      path.push(0)
      next()
    })

    app.get('/user/:id', (req, res, next) => {
      path.push(1)
      next()
    })

    app.use((req, res, next) => {
      path.push(2)
      next()
    })

    app.all('/user/:id', (req, res, next) => {
      path.push(3)
      next()
    })

    app.get('/*splat', (req, res, next) => {
      path.push(4)
      next()
    })

    app.use((req, res, next) => {
      path.push(5)
      res.end(path.join(','))
    })

    request(app)
      .get('/user/1')
      .expect(200, '0,1,2,3,4,5', done)
  })

  it('should be chainable', () => {
    const app = express()
    assert.strictEqual(app.get('/', () => { }), app)
  })

  it('should not use disposed router/middleware', (done) => {
    // more context: https://github.com/expressjs/express/issues/5743#issuecomment-2277148412

    const app = express()
    let router = new express.Router()

    router.use((req, res, next) => {
      res.setHeader('old', 'foo')
      next()
    })

    app.use((req, res, next) => router.handle(req, res, next))

    app.get('/', (req, res, next) => {
      res.send('yee')
      next()
    })

    request(app)
      .get('/')
      .expect('old', 'foo')
      .expect((res) => {
        if (typeof res.headers['new'] !== 'undefined') {
          throw new Error('`new` header should not be present')
        }
      })
      .expect(200, 'yee', (err, res) => {
        if (err) return done(err)

        router = new express.Router()

        router.use((req, res, next) => {
          res.setHeader('new', 'bar')
          next()
        })

        request(app)
          .get('/')
          .expect('new', 'bar')
          .expect((res) => {
            if (typeof res.headers['old'] !== 'undefined') {
              throw new Error('`old` header should not be present')
            }
          })
          .expect(200, 'yee', done)
      })
  })
})

function supportsRegexp (source) {
  try {
    // eslint-disable-next-line no-unused-vars
    const _ = new RegExp(source)
    return true
  } catch (e) {
    return false
  }
}
