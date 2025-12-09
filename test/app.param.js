'use strict'

const express = require('../')
const request = require('supertest')

describe('app', () => {
  describe('.param(names, fn)', () => {
    it('should map the array', (done) => {
      const app = express()

      app.param(['id', 'uid'], (req, res, next, id) => {
        id = Number(id)
        if (isNaN(id)) return next('route')
        req.params.id = id
        next()
      })

      app.get('/post/:id', (req, res) => {
        const id = req.params.id
        res.send((typeof id) + ':' + id)
      })

      app.get('/user/:uid', (req, res) => {
        const id = req.params.id
        res.send((typeof id) + ':' + id)
      })

      request(app)
        .get('/user/123')
        .expect(200, 'number:123', (err) => {
          if (err) return done(err)
          request(app)
            .get('/post/123')
            .expect('number:123', done)
        })
    })
  })

  describe('.param(name, fn)', () => {
    it('should map logic for a single param', (done) => {
      const app = express()

      app.param('id', (req, res, next, id) => {
        id = Number(id)
        if (isNaN(id)) return next('route')
        req.params.id = id
        next()
      })

      app.get('/user/:id', (req, res) => {
        const id = req.params.id
        res.send((typeof id) + ':' + id)
      })

      request(app)
        .get('/user/123')
        .expect(200, 'number:123', done)
    })

    it('should only call once per request', (done) => {
      const app = express()
      let called = 0
      let count = 0

      app.param('user', (req, res, next, user) => {
        called++
        req.user = user
        next()
      })

      app.get('/foo/:user', (req, res, next) => {
        count++
        next()
      })
      app.get('/foo/:user', (req, res, next) => {
        count++
        next()
      })
      app.use((req, res) => {
        res.end([count, called, req.user].join(' '))
      })

      request(app)
        .get('/foo/bob')
        .expect('2 1 bob', done)
    })

    it('should call when values differ', (done) => {
      const app = express()
      let called = 0
      let count = 0

      app.param('user', (req, res, next, user) => {
        called++
        req.users = (req.users || []).concat(user)
        next()
      })

      app.get('/:user/bob', (req, res, next) => {
        count++
        next()
      })
      app.get('/foo/:user', (req, res, next) => {
        count++
        next()
      })
      app.use((req, res) => {
        res.end([count, called, req.users.join(',')].join(' '))
      })

      request(app)
        .get('/foo/bob')
        .expect('2 2 foo,bob', done)
    })

    it('should support altering req.params across routes', (done) => {
      const app = express()

      app.param('user', (req, res, next, user) => {
        req.params.user = 'loki'
        next()
      })

      app.get('/:user', (req, res, next) => {
        next('route')
      })
      app.get('/:user', (req, res) => {
        res.send(req.params.user)
      })

      request(app)
        .get('/bob')
        .expect('loki', done)
    })

    it('should not invoke without route handler', (done) => {
      const app = express()

      app.param('thing', (req, res, next, thing) => {
        req.thing = thing
        next()
      })

      app.param('user', (req, res, next, user) => {
        next(new Error('invalid invocation'))
      })

      app.post('/:user', (req, res) => {
        res.send(req.params.user)
      })

      app.get('/:thing', (req, res) => {
        res.send(req.thing)
      })

      request(app)
        .get('/bob')
        .expect(200, 'bob', done)
    })

    it('should work with encoded values', (done) => {
      const app = express()

      app.param('name', (req, res, next, name) => {
        req.params.name = name
        next()
      })

      app.get('/user/:name', (req, res) => {
        const name = req.params.name
        res.send('' + name)
      })

      request(app)
        .get('/user/foo%25bar')
        .expect('foo%bar', done)
    })

    it('should catch thrown error', (done) => {
      const app = express()

      app.param('id', (req, res, next, id) => {
        throw new Error('err!')
      })

      app.get('/user/:id', (req, res) => {
        const id = req.params.id
        res.send('' + id)
      })

      request(app)
        .get('/user/123')
        .expect(500, done)
    })

    it('should catch thrown secondary error', (done) => {
      const app = express()

      app.param('id', (req, res, next, val) => {
        process.nextTick(next)
      })

      app.param('id', (req, res, next, id) => {
        throw new Error('err!')
      })

      app.get('/user/:id', (req, res) => {
        const id = req.params.id
        res.send('' + id)
      })

      request(app)
        .get('/user/123')
        .expect(500, done)
    })

    it('should defer to next route', (done) => {
      const app = express()

      app.param('id', (req, res, next, id) => {
        next('route')
      })

      app.get('/user/:id', (req, res) => {
        const id = req.params.id
        res.send('' + id)
      })

      app.get('/:name/123', (req, res) => {
        res.send('name')
      })

      request(app)
        .get('/user/123')
        .expect('name', done)
    })

    it('should defer all the param routes', (done) => {
      const app = express()

      app.param('id', (req, res, next, val) => {
        if (val === 'new') return next('route')
        return next()
      })

      app.all('/user/:id', (req, res) => {
        res.send('all.id')
      })

      app.get('/user/:id', (req, res) => {
        res.send('get.id')
      })

      app.get('/user/new', (req, res) => {
        res.send('get.new')
      })

      request(app)
        .get('/user/new')
        .expect('get.new', done)
    })

    it('should not call when values differ on error', (done) => {
      const app = express()
      let called = 0
      let count = 0

      app.param('user', (req, res, next, user) => {
        called++
        if (user === 'foo') throw new Error('err!')
        req.user = user
        next()
      })

      app.get('/:user/bob', (req, res, next) => {
        count++
        next()
      })
      app.get('/foo/:user', (req, res, next) => {
        count++
        next()
      })

      app.use((err, req, res, next) => {
        res.status(500)
        res.send([count, called, err.message].join(' '))
      })

      request(app)
        .get('/foo/bob')
        .expect(500, '0 1 err!', done)
    })

    it('should call when values differ when using "next"', (done) => {
      const app = express()
      let called = 0
      let count = 0

      app.param('user', (req, res, next, user) => {
        called++
        if (user === 'foo') return next('route')
        req.user = user
        next()
      })

      app.get('/:user/bob', (req, res, next) => {
        count++
        next()
      })
      app.get('/foo/:user', (req, res, next) => {
        count++
        next()
      })
      app.use((req, res) => {
        res.end([count, called, req.user].join(' '))
      })

      request(app)
        .get('/foo/bob')
        .expect('1 2 bob', done)
    })
  })
})
