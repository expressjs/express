'use strict'

const express = require('../')
const request = require('supertest')

describe('req.is()', () => {
  describe('when given a mime type', () => {
    it('should return the type when matching', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('application/json'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, '"application/json"', done)
    })

    it('should return false when not matching', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('image/jpeg'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, 'false', done)
    })

    it('should ignore charset', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('application/json'))
      })

      request(app)
        .post('/')
        .type('application/json; charset=UTF-8')
        .send('{}')
        .expect(200, '"application/json"', done)
    })
  })

  describe('when content-type is not present', () => {
    it('should return false', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('application/json'))
      })

      request(app)
        .post('/')
        .send('{}')
        .expect(200, 'false', done)
    })
  })

  describe('when given an extension', () => {
    it('should lookup the mime type', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('json'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, '"json"', done)
    })
  })

  describe('when given */subtype', () => {
    it('should return the full type when matching', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('*/json'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, '"application/json"', done)
    })

    it('should return false when not matching', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('*/html'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, 'false', done)
    })

    it('should ignore charset', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('*/json'))
      })

      request(app)
        .post('/')
        .type('application/json; charset=UTF-8')
        .send('{}')
        .expect(200, '"application/json"', done)
    })
  })

  describe('when given type/*', () => {
    it('should return the full type when matching', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('application/*'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, '"application/json"', done)
    })

    it('should return false when not matching', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('text/*'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, 'false', done)
    })

    it('should ignore charset', (done) => {
      const app = express()

      app.use((req, res) => {
        res.json(req.is('application/*'))
      })

      request(app)
        .post('/')
        .type('application/json; charset=UTF-8')
        .send('{}')
        .expect(200, '"application/json"', done)
    })
  })
})
