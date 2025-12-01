'use strict'

const express = require('../')
const request = require('supertest')

describe('req', () => {
  describe('.fresh', () => {
    it('should return true when the resource is not modified', (done) => {
      const app = express()
      const etag = '"12345"'

      app.use((req, res) => {
        res.set('ETag', etag)
        res.send(req.fresh)
      })

      request(app)
        .get('/')
        .set('If-None-Match', etag)
        .expect(304, done)
    })

    it('should return false when the resource is modified', (done) => {
      const app = express()

      app.use((req, res) => {
        res.set('ETag', '"123"')
        res.send(req.fresh)
      })

      request(app)
        .get('/')
        .set('If-None-Match', '"12345"')
        .expect(200, 'false', done)
    })

    it('should return false without response headers', (done) => {
      const app = express()

      app.disable('x-powered-by')
      app.use((req, res) => {
        res.send(req.fresh)
      })

      request(app)
        .get('/')
        .expect(200, 'false', done)
    })

    it('should ignore "If-Modified-Since" when "If-None-Match" is present', (done) => {
      const app = express()
      const etag = '"FooBar"'
      const now = Date.now()

      app.disable('x-powered-by')
      app.use((req, res) => {
        res.set('Etag', etag)
        res.set('Last-Modified', new Date(now).toUTCString())
        res.send(req.fresh)
      })

      request(app)
        .get('/')
        .set('If-Modified-Since', new Date(now - 1000).toUTCString)
        .set('If-None-Match', etag)
        .expect(304, done)
    })
  })
})
