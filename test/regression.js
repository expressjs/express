'use strict'

const express = require('../')
const request = require('supertest')

describe('throw after .end()', () => {
  it('should fail gracefully', (done) => {
    const app = express()

    app.get('/', (req, res) => {
      res.end('yay')
      throw new Error('boom')
    })

    request(app)
      .get('/')
      .expect('yay')
      .expect(200, done)
  })
})
