'use strict'

const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.type(str)', () => {
    it('should set the Content-Type based on a filename', (done) => {
      const app = express()

      app.use((req, res) => {
        res.type('foo.js').end('var name = "tj";')
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/javascript; charset=utf-8')
        .end(done)
    })

    it('should default to application/octet-stream', (done) => {
      const app = express()

      app.use((req, res) => {
        res.type('rawr').end('var name = "tj";')
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'application/octet-stream', done)
    })

    it('should set the Content-Type with type/subtype', (done) => {
      const app = express()

      app.use((req, res) => {
        res.type('application/vnd.amazon.ebook')
          .end('var name = "tj";')
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'application/vnd.amazon.ebook', done)
    })
  })
})
