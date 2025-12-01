'use strict'

const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.sendStatus(statusCode)', () => {
    it('should send the status code and message as body', (done) => {
      const app = express()

      app.use((req, res) => {
        res.sendStatus(201)
      })

      request(app)
        .get('/')
        .expect(201, 'Created', done)
    })

    it('should work with unknown code', (done) => {
      const app = express()

      app.use((req, res) => {
        res.sendStatus(599)
      })

      request(app)
        .get('/')
        .expect(599, '599', done)
    })

    it('should raise error for invalid status code', (done) => {
      const app = express()

      app.use((req, res) => {
        res.sendStatus(undefined).end()
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
    })
  })
})
