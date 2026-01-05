'use strict'

const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.links(obj)', () => {
    it('should set Link header field', (done) => {
      const app = express()

      app.use((req, res) => {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: 'http://api.example.com/users?page=5'
        })
        res.end()
      })

      request(app)
        .get('/')
        .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last"')
        .expect(200, done)
    })

    it('should set Link header field for multiple calls', (done) => {
      const app = express()

      app.use((req, res) => {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: 'http://api.example.com/users?page=5'
        })

        res.links({
          prev: 'http://api.example.com/users?page=1'
        })

        res.end()
      })

      request(app)
        .get('/')
        .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="prev"')
        .expect(200, done)
    })

    it('should set multiple links for single rel', (done) => {
      const app = express()

      app.use((req, res) => {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: ['http://api.example.com/users?page=5', 'http://api.example.com/users?page=1']
        })

        res.end()
      })

      request(app)
        .get('/')
        .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="last"')
        .expect(200, done)
    })
  })
})
