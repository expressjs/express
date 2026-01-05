'use strict'

const express = require('../')
const request = require('supertest')

describe('req', () => {
  describe('.route', () => {
    it('should be the executed Route', (done) => {
      const app = express()

      app.get('/user/:id{/:op}', (req, res, next) => {
        res.header('path-1', req.route.path)
        next()
      })

      app.get('/user/:id/edit', (req, res) => {
        res.header('path-2', req.route.path)
        res.end()
      })

      request(app)
        .get('/user/12/edit')
        .expect('path-1', '/user/:id{/:op}')
        .expect('path-2', '/user/:id/edit')
        .expect(200, done)
    })
  })
})
