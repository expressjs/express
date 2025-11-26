'use strict'

const express = require('../')
const request = require('supertest')

describe('req', () => {
  describe('.subdomains', () => {
    describe('when present', () => {
      it('should return an array', (done) => {
        const app = express()

        app.use((req, res) => {
          res.send(req.subdomains)
        })

        request(app)
          .get('/')
          .set('Host', 'tobi.ferrets.example.com')
          .expect(200, ['ferrets', 'tobi'], done)
      })

      it('should work with IPv4 address', (done) => {
        const app = express()

        app.use((req, res) => {
          res.send(req.subdomains)
        })

        request(app)
          .get('/')
          .set('Host', '127.0.0.1')
          .expect(200, [], done)
      })

      it('should work with IPv6 address', (done) => {
        const app = express()

        app.use((req, res) => {
          res.send(req.subdomains)
        })

        request(app)
          .get('/')
          .set('Host', '[::1]')
          .expect(200, [], done)
      })
    })

    describe('otherwise', () => {
      it('should return an empty array', (done) => {
        const app = express()

        app.use((req, res) => {
          res.send(req.subdomains)
        })

        request(app)
          .get('/')
          .set('Host', 'example.com')
          .expect(200, [], done)
      })
    })

    describe('with no host', () => {
      it('should return an empty array', (done) => {
        const app = express()

        app.use((req, res) => {
          req.headers.host = null
          res.send(req.subdomains)
        })

        request(app)
          .get('/')
          .expect(200, [], done)
      })
    })

    describe('with trusted X-Forwarded-Host', () => {
      it('should return an array', (done) => {
        const app = express()

        app.set('trust proxy', true)
        app.use((req, res) => {
          res.send(req.subdomains)
        })

        request(app)
          .get('/')
          .set('X-Forwarded-Host', 'tobi.ferrets.example.com')
          .expect(200, ['ferrets', 'tobi'], done)
      })
    })

    describe('when subdomain offset is set', () => {
      describe('when subdomain offset is zero', () => {
        it('should return an array with the whole domain', (done) => {
          const app = express()
          app.set('subdomain offset', 0)

          app.use((req, res) => {
            res.send(req.subdomains)
          })

          request(app)
            .get('/')
            .set('Host', 'tobi.ferrets.sub.example.com')
            .expect(200, ['com', 'example', 'sub', 'ferrets', 'tobi'], done)
        })

        it('should return an array with the whole IPv4', (done) => {
          const app = express()
          app.set('subdomain offset', 0)

          app.use((req, res) => {
            res.send(req.subdomains)
          })

          request(app)
            .get('/')
            .set('Host', '127.0.0.1')
            .expect(200, ['127.0.0.1'], done)
        })

        it('should return an array with the whole IPv6', (done) => {
          const app = express()
          app.set('subdomain offset', 0)

          app.use((req, res) => {
            res.send(req.subdomains)
          })

          request(app)
            .get('/')
            .set('Host', '[::1]')
            .expect(200, ['[::1]'], done)
        })
      })

      describe('when present', () => {
        it('should return an array', (done) => {
          const app = express()
          app.set('subdomain offset', 3)

          app.use((req, res) => {
            res.send(req.subdomains)
          })

          request(app)
            .get('/')
            .set('Host', 'tobi.ferrets.sub.example.com')
            .expect(200, ['ferrets', 'tobi'], done)
        })
      })

      describe('otherwise', () => {
        it('should return an empty array', (done) => {
          const app = express()
          app.set('subdomain offset', 3)

          app.use((req, res) => {
            res.send(req.subdomains)
          })

          request(app)
            .get('/')
            .set('Host', 'sub.example.com')
            .expect(200, [], done)
        })
      })
    })
  })
})
