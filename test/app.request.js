'use strict'

const after = require('after')
const express = require('../')
const request = require('supertest')

describe('app', () => {
  describe('.request', () => {
    it('should extend the request prototype', (done) => {
      const app = express()

      app.request.querystring = function () {
        return (new URL(this.url)).query
      }

      app.use((req, res) => {
        res.end(req.querystring())
      })

      request(app)
        .get('/foo?name=tobi')
        .expect('name=tobi', done)
    })

    it('should only extend for the referenced app', (done) => {
      const app1 = express()
      const app2 = express()
      const cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app1.get('/', (req, res) => {
        res.send(req.foobar())
      })

      app2.get('/', (req, res) => {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app2)
        .get('/')
        .expect(500, /(?:not a function|has no method)/, cb)
    })

    it('should inherit to sub apps', (done) => {
      const app1 = express()
      const app2 = express()
      const cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app1.use('/sub', app2)

      app1.get('/', (req, res) => {
        res.send(req.foobar())
      })

      app2.get('/', (req, res) => {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'tobi', cb)
    })

    it('should allow sub app to override', (done) => {
      const app1 = express()
      const app2 = express()
      const cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app2.request.foobar = function () {
        return 'loki'
      }

      app1.use('/sub', app2)

      app1.get('/', (req, res) => {
        res.send(req.foobar())
      })

      app2.get('/', (req, res) => {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'loki', cb)
    })

    it('should not pollute parent app', (done) => {
      const app1 = express()
      const app2 = express()
      const cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app2.request.foobar = function () {
        return 'loki'
      }

      app1.use('/sub', app2)

      app1.get('/sub/foo', (req, res) => {
        res.send(req.foobar())
      })

      app2.get('/', (req, res) => {
        res.send(req.foobar())
      })

      request(app1)
        .get('/sub')
        .expect(200, 'loki', cb)

      request(app1)
        .get('/sub/foo')
        .expect(200, 'tobi', cb)
    })
  })
})
