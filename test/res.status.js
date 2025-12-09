'use strict'
const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.status(code)', () => {
    it('should set the status code when valid', (done) => {
      const app = express()

      app.use((req, res) => {
        res.status(200).end()
      })

      request(app)
        .get('/')
        .expect(200, done)
    })

    describe('accept valid ranges', () => {
      // not testing w/ 100, because that has specific meaning and behavior in Node as Expect: 100-continue
      it('should set the response status code to 101', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(101).end()
        })

        request(app)
          .get('/')
          .expect(101, done)
      })

      it('should set the response status code to 201', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(201).end()
        })

        request(app)
          .get('/')
          .expect(201, done)
      })

      it('should set the response status code to 302', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(302).end()
        })

        request(app)
          .get('/')
          .expect(302, done)
      })

      it('should set the response status code to 403', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(403).end()
        })

        request(app)
          .get('/')
          .expect(403, done)
      })

      it('should set the response status code to 501', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(501).end()
        })

        request(app)
          .get('/')
          .expect(501, done)
      })

      it('should set the response status code to 700', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(700).end()
        })

        request(app)
          .get('/')
          .expect(700, done)
      })

      it('should set the response status code to 800', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(800).end()
        })

        request(app)
          .get('/')
          .expect(800, done)
      })

      it('should set the response status code to 900', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(900).end()
        })

        request(app)
          .get('/')
          .expect(900, done)
      })
    })

    describe('invalid status codes', () => {
      it('should raise error for status code below 100', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(99).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done)
      })

      it('should raise error for status code above 999', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(1000).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done)
      })

      it('should raise error for non-integer status codes', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(200.1).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done)
      })

      it('should raise error for undefined status code', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(undefined).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done)
      })

      it('should raise error for null status code', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(null).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done)
      })

      it('should raise error for string status code', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status('200').end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done)
      })

      it('should raise error for NaN status code', (done) => {
        const app = express()

        app.use((req, res) => {
          res.status(NaN).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done)
      })
    })
  })
})
