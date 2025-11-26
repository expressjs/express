'use strict'

const express = require('../')
const request = require('supertest')
const assert = require('node:assert')

describe('req', () => {
  describe('.get(field)', () => {
    it('should return the header field value', (done) => {
      const app = express()

      app.use((req, res) => {
        assert(req.get('Something-Else') === undefined)
        res.end(req.get('Content-Type'))
      })

      request(app)
        .post('/')
        .set('Content-Type', 'application/json')
        .expect('application/json', done)
    })

    it('should special-case Referer', (done) => {
      const app = express()

      app.use((req, res) => {
        res.end(req.get('Referer'))
      })

      request(app)
        .post('/')
        .set('Referrer', 'http://foobar.com')
        .expect('http://foobar.com', done)
    })

    it('should throw missing header name', (done) => {
      const app = express()

      app.use((req, res) => {
        res.end(req.get())
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: name argument is required to req.get/, done)
    })

    it('should throw for non-string header name', (done) => {
      const app = express()

      app.use((req, res) => {
        res.end(req.get(42))
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: name must be a string to req.get/, done)
    })
  })
})
