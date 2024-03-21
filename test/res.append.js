'use strict'

var assert = require('assert')
var express = require('..')
var request = require('supertest')

describe('res', function () {
  describe('.append(field, val)', function () {
    it('should append multiple headers', function (done) {
      var app = express()

      app.use(function (req, res, next) {
        res.append('Set-Cookie', 'foo=bar')
        next()
      })

      app.use(function (req, res) {
        res.append('Set-Cookie', 'fizz=buzz')
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['foo=bar', 'fizz=buzz']))
        .end(done)
    })

    it('should accept array of values', function (done) {
      var app = express()

      app.use(function (req, res, next) {
        res.append('Set-Cookie', ['foo=bar', 'fizz=buzz'])
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['foo=bar', 'fizz=buzz']))
        .end(done)
    })

    it('should get reset by res.set(field, val)', function (done) {
      var app = express()

      app.use(function (req, res, next) {
        res.append('Set-Cookie', 'foo=bar')
        res.append('Set-Cookie', 'fizz=buzz')
        next()
      })

      app.use(function (req, res) {
        res.set('Set-Cookie', 'pet=tobi')
        res.end()
      });

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['pet=tobi']))
        .end(done)
    })

    it('should work with res.set(field, val) first', function (done) {
      var app = express()

      app.use(function (req, res, next) {
        res.set('Set-Cookie', 'foo=bar')
        next()
      })

      app.use(function(req, res){
        res.append('Set-Cookie', 'fizz=buzz')
        res.end()
      })

      request(app)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaderValues('Set-Cookie', ['foo=bar', 'fizz=buzz']))
        .end(done)
    })

    it('should work together with res.cookie', function (done) {
      var app = express()

      app.use(function (req, res, next) {
        res.cookie('foo', 'bar')
        next()
      })

      app.use(function (req, res) {
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
    var headers = res.headers[key.toLowerCase()]
    assert.ok(headers, 'should have header "' + key + '"')
    assert.strictEqual(headers.length, values.length, 'should have ' + values.length + ' occurances of "' + key + '"')
    for (var i = 0; i < values.length; i++) {
      assert.strictEqual(headers[i], values[i])
    }
  }
}
