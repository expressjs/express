'use strict'

const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.get(field)', () => {
    it('should get the response header field', (done) => {
      const app = express()

      app.use((req, res) => {
        res.setHeader('Content-Type', 'text/x-foo')
        res.send(res.get('Content-Type'))
      })

      request(app)
        .get('/')
        .expect(200, 'text/x-foo', done)
    })
  })
})
