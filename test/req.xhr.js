'use strict'

const express = require('../')
const request = require('supertest')

describe('req', () => {
  describe('.xhr', () => {
    before(function () {
      this.app = express()
      this.app.get('/', (req, res) => {
        res.send(req.xhr)
      })
    })

    it('should return true when X-Requested-With is xmlhttprequest', function (done) {
      request(this.app)
        .get('/')
        .set('X-Requested-With', 'xmlhttprequest')
        .expect(200, 'true', done)
    })

    it('should case-insensitive', function (done) {
      request(this.app)
        .get('/')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect(200, 'true', done)
    })

    it('should return false otherwise', function (done) {
      request(this.app)
        .get('/')
        .set('X-Requested-With', 'blahblah')
        .expect(200, 'false', done)
    })

    it('should return false when not present', function (done) {
      request(this.app)
        .get('/')
        .expect(200, 'false', done)
    })
  })
})
