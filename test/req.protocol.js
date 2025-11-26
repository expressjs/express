'use strict'

const express = require('../')
const request = require('supertest')

describe('req', () => {
  describe('.protocol', () => {
    it('should return the protocol string', (done) => {
      const app = express()

      app.use((req, res) => {
        res.end(req.protocol)
      })

      request(app)
        .get('/')
        .expect('http', done)
    })

    describe('when "trust proxy" is enabled', () => {
      it('should respect X-Forwarded-Proto', (done) => {
        const app = express()

        app.enable('trust proxy')

        app.use((req, res) => {
          res.end(req.protocol)
        })

        request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('https', done)
      })

      it('should default to the socket addr if X-Forwarded-Proto not present', (done) => {
        const app = express()

        app.enable('trust proxy')

        app.use((req, res) => {
          req.socket.encrypted = true
          res.end(req.protocol)
        })

        request(app)
          .get('/')
          .expect('https', done)
      })

      it('should ignore X-Forwarded-Proto if socket addr not trusted', (done) => {
        const app = express()

        app.set('trust proxy', '10.0.0.1')

        app.use((req, res) => {
          res.end(req.protocol)
        })

        request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('http', done)
      })

      it('should default to http', (done) => {
        const app = express()

        app.enable('trust proxy')

        app.use((req, res) => {
          res.end(req.protocol)
        })

        request(app)
          .get('/')
          .expect('http', done)
      })

      describe('when trusting hop count', () => {
        it('should respect X-Forwarded-Proto', (done) => {
          const app = express()

          app.set('trust proxy', 1)

          app.use((req, res) => {
            res.end(req.protocol)
          })

          request(app)
            .get('/')
            .set('X-Forwarded-Proto', 'https')
            .expect('https', done)
        })
      })
    })

    describe('when "trust proxy" is disabled', () => {
      it('should ignore X-Forwarded-Proto', (done) => {
        const app = express()

        app.use((req, res) => {
          res.end(req.protocol)
        })

        request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('http', done)
      })
    })
  })
})
