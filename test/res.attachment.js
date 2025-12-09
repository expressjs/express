'use strict'

const { Buffer } = require('node:buffer')

const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.attachment()', () => {
    it('should Content-Disposition to attachment', (done) => {
      const app = express()

      app.use((req, res) => {
        res.attachment().send('foo')
      })

      request(app)
        .get('/')
        .expect('Content-Disposition', 'attachment', done)
    })
  })

  describe('.attachment(filename)', () => {
    it('should add the filename param', (done) => {
      const app = express()

      app.use((req, res) => {
        res.attachment('/path/to/image.png')
        res.send('foo')
      })

      request(app)
        .get('/')
        .expect('Content-Disposition', 'attachment; filename="image.png"', done)
    })

    it('should set the Content-Type', (done) => {
      const app = express()

      app.use((req, res) => {
        res.attachment('/path/to/image.png')
        res.send(Buffer.alloc(4, '.'))
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'image/png', done)
    })
  })

  describe('.attachment(utf8filename)', () => {
    it('should add the filename and filename* params', (done) => {
      const app = express()

      app.use((req, res) => {
        res.attachment('/locales/日本語.txt')
        res.send('japanese')
      })

      request(app)
        .get('/')
        .expect('Content-Disposition', 'attachment; filename="???.txt"; filename*=UTF-8\'\'%E6%97%A5%E6%9C%AC%E8%AA%9E.txt')
        .expect(200, done)
    })

    it('should set the Content-Type', (done) => {
      const app = express()

      app.use((req, res) => {
        res.attachment('/locales/日本語.txt')
        res.send('japanese')
      })

      request(app)
        .get('/')
        .expect('Content-Type', 'text/plain; charset=utf-8', done)
    })
  })
})
