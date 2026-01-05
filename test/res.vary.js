'use strict'

const express = require('../')
const request = require('supertest')
const utils = require('./support/utils')

describe('res.vary()', () => {
  describe('with no arguments', () => {
    it('should throw error', (done) => {
      const app = express()

      app.use((req, res) => {
        res.vary()
        res.end()
      })

      request(app)
        .get('/')
        .expect(500, /field.*required/, done)
    })
  })

  describe('with an empty array', () => {
    it('should not set Vary', (done) => {
      const app = express()

      app.use((req, res) => {
        res.vary([])
        res.end()
      })

      request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Vary'))
        .expect(200, done)
    })
  })

  describe('with an array', () => {
    it('should set the values', (done) => {
      const app = express()

      app.use((req, res) => {
        res.vary(['Accept', 'Accept-Language', 'Accept-Encoding'])
        res.end()
      })

      request(app)
        .get('/')
        .expect('Vary', 'Accept, Accept-Language, Accept-Encoding')
        .expect(200, done)
    })
  })

  describe('with a string', () => {
    it('should set the value', (done) => {
      const app = express()

      app.use((req, res) => {
        res.vary('Accept')
        res.end()
      })

      request(app)
        .get('/')
        .expect('Vary', 'Accept')
        .expect(200, done)
    })
  })

  describe('when the value is present', () => {
    it('should not add it again', (done) => {
      const app = express()

      app.use((req, res) => {
        res.vary('Accept')
        res.vary('Accept-Encoding')
        res.vary('Accept-Encoding')
        res.vary('Accept-Encoding')
        res.vary('Accept')
        res.end()
      })

      request(app)
        .get('/')
        .expect('Vary', 'Accept, Accept-Encoding')
        .expect(200, done)
    })
  })
})
