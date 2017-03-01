
var assert = require('assert');
var express = require('..');
var request = require('supertest')

describe('req', function(){
  describe('.range(size)', function(){
    it('should return parsed ranges', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-50,51-100')
      .expect(200, '[{"start":0,"end":50},{"start":51,"end":100}]', done)
    })

    it('should cap to the given size', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(75))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-100')
      .expect(200, '[{"start":0,"end":74}]', done)
    })

    it('should cap to the given size when open-ended', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(75))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-')
      .expect(200, '[{"start":0,"end":74}]', done)
    })

    it('should have a .type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120).type)
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-100')
      .expect(200, '"bytes"', done)
    })

    it('should accept any type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120).type)
      })

      request(app)
      .get('/')
      .set('Range', 'users=0-2')
      .expect(200, '"users"', done)
    })

    it('should return undefined if no range', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.send(String(req.range(120)))
      })

      request(app)
      .get('/')
      .expect(200, 'undefined', done)
    })
  })

  describe('.range(size, options)', function(){
    describe('with "combine: true" option', function(){
      it('should return combined ranges', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.json(req.range(120, {
            combine: true
          }))
        })

        request(app)
        .get('/')
        .set('Range', 'bytes=0-50,51-100')
        .expect(200, '[{"start":0,"end":100}]', done)
      })
    })
  })
})
