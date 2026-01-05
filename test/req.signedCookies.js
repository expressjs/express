'use strict'

const express = require('../')
const request = require('supertest')
const cookieParser = require('cookie-parser')

describe('req', () => {
  describe('.signedCookies', () => {
    it('should return a signed JSON cookie', (done) => {
      const app = express()

      app.use(cookieParser('secret'))

      app.use((req, res) => {
        if (req.path === '/set') {
          res.cookie('obj', { foo: 'bar' }, { signed: true })
          res.end()
        } else {
          res.send(req.signedCookies)
        }
      })

      request(app)
        .get('/set')
        .end((err, res) => {
          if (err) return done(err)
          const cookie = res.header['set-cookie']

          request(app)
            .get('/')
            .set('Cookie', cookie)
            .expect(200, { obj: { foo: 'bar' } }, done)
        })
    })
  })
})
