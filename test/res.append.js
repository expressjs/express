'use strict'

const assert = require('node:assert')
const express = require('../')
const request = require('supertest')

describe('res', () => {
  describe('.append(field, val)', () => {
    it('should append multiple headers', (done) => {
      const app = express()

      app.use((req, res, next) => {
        res.append('Set-Cookie', 'foo=bar')
        next()
      })

      app.use((req, res) => {
        res.append('Set-Cookie', 'fizz=buzz')
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['foo=bar', 'fizz=buzz']))
        .end(done)
    })

    it('should accept array of values', (done) => {
      const app = express()

      app.use((req, res, next) => {
        res.append('Set-Cookie', ['foo=bar', 'fizz=buzz'])
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['foo=bar', 'fizz=buzz']))
        .end(done)
    })

    it('should get reset by res.set(field, val)', (done) => {
      const app = express()

      app.use((req, res, next) => {
        res.append('Set-Cookie', 'foo=bar')
        res.append('Set-Cookie', 'fizz=buzz')
        next()
      })

      app.use((req, res) => {
        res.set('Set-Cookie', 'pet=tobi')
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['pet=tobi']))
        .end(done)
    })

    it('should work with res.set(field, val) first', (done) => {
      const app = express()

      app.use((req, res, next) => {
        res.set('Set-Cookie', 'foo=bar')
        next()
      })

      app.use((req, res) => {
        res.append('Set-Cookie', 'fizz=buzz')
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['foo=bar', 'fizz=buzz']))
        .end(done)
    })

    it('should work together with res.cookie', (done) => {
      const app = express()

      app.use((req, res, next) => {
        res.cookie('foo', 'bar')
        next()
      })

      app.use((req, res) => {
        res.append('Set-Cookie', 'fizz=buzz')
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['foo=bar; Path=/', 'fizz=buzz']))
        .end(done)
    })
  })
})

function shouldHaveHeaderValues (key, values) {
  return function (res) {
    const headers = res.headers[key.toLowerCase()]
    assert.ok(headers, 'should have header "' + key + '"')
    assert.strictEqual(headers.length, values.length, 'should have ' + values.length + ' occurrences of "' + key + '"')
    for (let i = 0; i < values.length; i++) {
      assert.strictEqual(headers[i], values[i])
    }
  }
}
