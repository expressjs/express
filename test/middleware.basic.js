'use strict'

const assert = require('node:assert')
const express = require('../')
const request = require('supertest')

describe('middleware', () => {
  describe('.next()', () => {
    it('should behave like connect', (done) => {
      const app = express()
      const calls = []

      app.use((req, res, next) => {
        calls.push('one')
        next()
      })

      app.use((req, res, next) => {
        calls.push('two')
        next()
      })

      app.use((req, res) => {
        let buf = ''
        res.setHeader('Content-Type', 'application/json')
        req.setEncoding('utf8')
        req.on('data', (chunk) => { buf += chunk })
        req.on('end', () => {
          res.end(buf)
        })
      })

      request(app)
        .get('/')
        .set('Content-Type', 'application/json')
        .send('{"foo":"bar"}')
        .expect('Content-Type', 'application/json')
        .expect(() => { assert.deepEqual(calls, ['one', 'two']) })
        .expect(200, '{"foo":"bar"}', done)
    })
  })
})
