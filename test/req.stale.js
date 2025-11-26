'use strict'

const express = require('../')
const request = require('supertest')

describe('req', () => {
  describe('.stale', () => {
    it('should return false when the resource is not modified', (done) => {
      const app = express()
      const etag = '"12345"'

      app.use((req, res) => {
        res.set('ETag', etag)
        res.send(req.stale)
      })

      request(app)
        .get('/')
        .set('If-None-Match', etag)
        .expect(304, done)
    })

    it('should return true when the resource is modified', (done) => {
      const app = express()

      app.use((req, res) => {
        res.set('ETag', '"123"')
        res.send(req.stale)
      })

      request(app)
        .get('/')
        .set('If-None-Match', '"12345"')
        .expect(200, 'true', done)
    })

    it('should return true without response headers', (done) => {
      const app = express()

      app.disable('x-powered-by')
      app.use((req, res) => {
        res.send(req.stale)
      })

      request(app)
        .get('/')
        .expect(200, 'true', done)
    })
  })
})
