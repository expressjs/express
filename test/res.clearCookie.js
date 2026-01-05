'use strict'

const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.clearCookie(name)', () => {
    it('should set a cookie passed expiry', (done) => {
      const app = express()

      app.use((req, res) => {
        res.clearCookie('sid').end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
        .expect(200, done)
    })
  })

  describe('.clearCookie(name, options)', () => {
    it('should set the given params', (done) => {
      const app = express()

      app.use((req, res) => {
        res.clearCookie('sid', { path: '/admin' }).end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'sid=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
        .expect(200, done)
    })

    it('should ignore maxAge', (done) => {
      const app = express()

      app.use((req, res) => {
        res.clearCookie('sid', { path: '/admin', maxAge: 1000 }).end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'sid=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
        .expect(200, done)
    })

    it('should ignore user supplied expires param', (done) => {
      const app = express()

      app.use((req, res) => {
        res.clearCookie('sid', { path: '/admin', expires: new Date() }).end()
      })

      request(app)
        .get('/')
        .expect('Set-Cookie', 'sid=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
        .expect(200, done)
    })
  })
})
