'use strict'

var express = require('../')
var request = require('supertest')

var isIoJs = process.release
  ? process.release.name === 'io.js'
  : ['v1.', 'v2.', 'v3.'].indexOf(process.version.slice(0, 3)) !== -1

describe('res', function () {
  describe('.status(code)', function () {
    describe('when "code" is undefined', function () {
      it('should raise error for invalid status code', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(undefined).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, function (err) {
            if (isIoJs) {
              done(err ? null : new Error('expected error'))
            } else {
              done(err)
            }
          })
      })
    })

    describe('when "code" is null', function () {
      it('should raise error for invalid status code', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(null).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, function (err) {
            if (isIoJs) {
              done(err ? null : new Error('expected error'))
            } else {
              done(err)
            }
          })
      })
    })

    describe('when "code" is 201', function () {
      it('should set the response status code to 201', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(201).end()
        })

        request(app)
          .get('/')
          .expect(201, done)
      })
    })

    describe('when "code" is 302', function () {
      it('should set the response status code to 302', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(302).end()
        })

        request(app)
          .get('/')
          .expect(302, done)
      })
    })

    describe('when "code" is 403', function () {
      it('should set the response status code to 403', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(403).end()
        })

        request(app)
          .get('/')
          .expect(403, done)
      })
    })

    describe('when "code" is 501', function () {
      it('should set the response status code to 501', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(501).end()
        })

        request(app)
          .get('/')
          .expect(501, done)
      })
    })

    describe('when "code" is "410"', function () {
      it('should set the response status code to 410', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status('410').end()
        })

        request(app)
          .get('/')
          .expect(410, done)
      })
    })

    describe('when "code" is 410.1', function () {
      it('should set the response status code to 410', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(410.1).end()
        })

        request(app)
          .get('/')
          .expect(410, function (err) {
            if (isIoJs) {
              done(err ? null : new Error('expected error'))
            } else {
              done(err)
            }
          })
      })
    })

    describe('when "code" is 1000', function () {
      it('should raise error for invalid status code', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(1000).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, function (err) {
            if (isIoJs) {
              done(err ? null : new Error('expected error'))
            } else {
              done(err)
            }
          })
      })
    })

    describe('when "code" is 99', function () {
      it('should raise error for invalid status code', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(99).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, function (err) {
            if (isIoJs) {
              done(err ? null : new Error('expected error'))
            } else {
              done(err)
            }
          })
      })
    })

    describe('when "code" is -401', function () {
      it('should raise error for invalid status code', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(-401).end()
        })

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, function (err) {
            if (isIoJs) {
              done(err ? null : new Error('expected error'))
            } else {
              done(err)
            }
          })
      })
    })
  })
})
