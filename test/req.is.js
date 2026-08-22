'use strict'

var express = require('..')
var request = require('supertest')
var after = require('after')

describe('req.is()', function () {
  describe('when given a mime type', function () {
    it('should return the type when matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/json'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"application/json"', done)
    })

    it('should return false when not matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('image/jpeg'))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, 'false', done)
    })

    it('should return false when none in list matches', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is(['image/jpeg', 'text/html']))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, 'false', done)
    })

    it('should ignore charset', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/json'))
      })

      request(app)
        .post('/')
        .type('application/json; charset=UTF-8')
        .send('{}')
        .expect(200, '"application/json"', done)
    })
  })

  describe('when content-type is not present', function(){
    it('should return false for single type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/json'))
      })

      request(app)
      .post('/')
      .send('{}')
      .expect(200, 'false', done)
    })

    it('should return false for multiple types', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is(['application/json', 'image/jpeg']))
      })

      request(app)
        .post('/')
        .send('{}')
        .expect(200, 'false', done)
    })
  })

  describe('when given an extension', function(){
    it('should lookup the mime type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('json'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"json"', done)
    })

    it('should lookup the first matching extension from list', function (done) {
      var app = express()
      var cb = after(2, done)

      app.use(function (req, res) {
        res.json(req.is(['json', 'html']))
      })

      request(app)
        .post('/')
        .type('application/json')
        .send('{}')
        .expect(200, '"json"', cb)

      request(app)
        .post('/')
        .type('text/html')
        .send('{}')
        .expect(200, '"html"', cb)
    })
  })

  describe('when given */subtype', function(){
    it('should return the full type when matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('*/json'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"application/json"', done)
    })

    it('should return false when not matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('*/html'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, 'false', done)
    })

    it('should ignore charset', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('*/json'))
      })

      request(app)
      .post('/')
      .type('application/json; charset=UTF-8')
      .send('{}')
      .expect(200, '"application/json"', done)
    })
  })

  describe('when given type/*', function(){
    it('should return the full type when matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/*'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"application/json"', done)
    })

    it('should return false when not matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('text/*'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, 'false', done)
    })

    it('should ignore charset', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/*'))
      })

      request(app)
      .post('/')
      .type('application/json; charset=UTF-8')
      .send('{}')
      .expect(200, '"application/json"', done)
    })
  })

  it('should match wildcards in list and return full type or false', function (done){
    var app = express()
    var cb = after(3, done)

    app.use(function (req, res) {
      res.json(req.is(['application/*', '*/jpeg']))
    })

    request(app)
      .post('/')
      .type('image/jpeg')
      .send('{}')
      .expect(200, '"image/jpeg"', cb)

    request(app)
      .post('/')
      .type('text/html')
      .send('{}')
      .expect(200, 'false', cb)

    request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"application/json"', cb)
  })
})
