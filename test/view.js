'use strict'

var assert = require('node:assert')
var express = require('..')
var path = require('node:path')
var request = require('supertest')
var tmpl = require('./support/tmpl')

describe('View', function () {
  it('should handle missing options object', function () {
    assert.throws(function () {
      new View('name')
    }, /No default engine was specified and no extension was provided\./)
  })

  describe('integration', function () {
    it('should throw error via app.render() without view engine or extension', function (done) {
      var app = express()

      try {
        app.render('user', function (err) {
          done(new Error('Should have thrown'))
        })
        done(new Error('Should have thrown'))
      } catch (err) {
        assert.match(err.message, /No default engine was specified and no extension was provided\./)
        done()
      }
    })

    it('should throw error via res.render() without view engine or extension', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.render('user')
      })

      request(app)
        .get('/')
        .expect(500, /No default engine was specified and no extension was provided\./, done)
    })

    it('should throw error for non-existent view engine', function (done) {
      var app = express()

      app.set('view engine', 'unknown')
      app.set('views', path.join(__dirname, 'fixtures'))

      try {
        app.render('user', function (err) {
          done(new Error('Should have thrown'))
        })
        done(new Error('Should have thrown'))
      } catch (err) {
        assert.match(err.message, /Cannot find module/)
        done()
      }
    })

    it('should throw error via res.render() for non-existent view engine', function (done) {
      var app = express()

      app.set('view engine', 'unknown')
      app.set('views', path.join(__dirname, 'fixtures'))

      app.use(function (req, res) {
        res.render('user')
      })

      request(app)
        .get('/')
        .expect(500, /Cannot find module/, done)
    })

    it('should successfully render via res.render() with valid engine', function (done) {
      var app = express()

      app.engine('tmpl', tmpl)
      app.set('view engine', 'tmpl')
      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.use(function (req, res) {
        res.render('user')
      })

      request(app)
        .get('/')
        .expect('<p>tobi</p>', done)
    })

    it('should reuse cached engine on second render', function (done) {
      var app = express()

      app.engine('tmpl', tmpl)
      app.set('view engine', 'tmpl')
      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'loki' }

      var renderCount = 0
      app.use(function (req, res) {
        if (renderCount === 0) {
          renderCount++
          res.render('user', function (err, html) {
            if (err) return res.send(500)
            // render again to test cached engine
            res.render('user', function (err, html2) {
              if (err) return res.send(500)
              res.send(html2)
            })
          })
        }
      })

      request(app)
        .get('/')
        .expect('<p>loki</p>', done)
    })
  })
})

function View(name) {
  var View = require('../lib/view')
  return new View(name)
}
