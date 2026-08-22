'use strict'

var assert = require('node:assert')
var express = require('../')
var request = require('supertest')

describe('error codes', function () {
  describe('exports', function () {
    it('should expose errorCodes object', function () {
      assert.strictEqual(typeof express.errorCodes, 'object')
    })

    it('should expose frozen errorCodes object', function () {
      assert.strictEqual(Object.isFrozen(express.errorCodes), true)
    })

    it('should expose all error codes', function () {
      var codes = express.errorCodes
      // Response errors
      assert.strictEqual(codes.ERR_INVALID_STATUS_CODE, 'ERR_INVALID_STATUS_CODE')
      assert.strictEqual(codes.ERR_STATUS_CODE_OUT_OF_RANGE, 'ERR_STATUS_CODE_OUT_OF_RANGE')
      assert.strictEqual(codes.ERR_SENDFILE_PATH_REQUIRED, 'ERR_SENDFILE_PATH_REQUIRED')
      assert.strictEqual(codes.ERR_SENDFILE_PATH_NOT_STRING, 'ERR_SENDFILE_PATH_NOT_STRING')
      assert.strictEqual(codes.ERR_SENDFILE_PATH_NOT_ABSOLUTE, 'ERR_SENDFILE_PATH_NOT_ABSOLUTE')
      assert.strictEqual(codes.ERR_CONTENT_TYPE_ARRAY, 'ERR_CONTENT_TYPE_ARRAY')
      assert.strictEqual(codes.ERR_COOKIE_SECRET_REQUIRED, 'ERR_COOKIE_SECRET_REQUIRED')
      // Application/middleware errors
      assert.strictEqual(codes.ERR_MIDDLEWARE_REQUIRED, 'ERR_MIDDLEWARE_REQUIRED')
      assert.strictEqual(codes.ERR_ENGINE_CALLBACK_REQUIRED, 'ERR_ENGINE_CALLBACK_REQUIRED')
      // Request errors
      assert.strictEqual(codes.ERR_HEADER_NAME_REQUIRED, 'ERR_HEADER_NAME_REQUIRED')
      assert.strictEqual(codes.ERR_HEADER_NAME_NOT_STRING, 'ERR_HEADER_NAME_NOT_STRING')
      // View errors
      assert.strictEqual(codes.ERR_NO_DEFAULT_ENGINE, 'ERR_NO_DEFAULT_ENGINE')
      assert.strictEqual(codes.ERR_VIEW_ENGINE_NOT_FOUND, 'ERR_VIEW_ENGINE_NOT_FOUND')
      // Configuration errors
      assert.strictEqual(codes.ERR_INVALID_ETAG_OPTION, 'ERR_INVALID_ETAG_OPTION')
      assert.strictEqual(codes.ERR_INVALID_QUERY_PARSER_OPTION, 'ERR_INVALID_QUERY_PARSER_OPTION')
    })
  })

  describe('res.status()', function () {
    it('should have ERR_INVALID_STATUS_CODE for non-integer', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          res.status('200')
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_INVALID_STATUS_CODE')
          assert.strictEqual(res.body.name, 'TypeError')
        })
        .end(done)
    })

    it('should have ERR_STATUS_CODE_OUT_OF_RANGE for invalid range', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          res.status(1000)
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_STATUS_CODE_OUT_OF_RANGE')
          assert.strictEqual(res.body.name, 'RangeError')
        })
        .end(done)
    })
  })

  describe('res.sendFile()', function () {
    it('should have ERR_SENDFILE_PATH_REQUIRED when path is missing', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          res.sendFile()
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_SENDFILE_PATH_REQUIRED')
          assert.strictEqual(res.body.name, 'TypeError')
        })
        .end(done)
    })

    it('should have ERR_SENDFILE_PATH_NOT_STRING when path is not a string', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          res.sendFile(42)
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_SENDFILE_PATH_NOT_STRING')
          assert.strictEqual(res.body.name, 'TypeError')
        })
        .end(done)
    })

    it('should have ERR_SENDFILE_PATH_NOT_ABSOLUTE when path is relative without root', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          res.sendFile('relative/path.txt')
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_SENDFILE_PATH_NOT_ABSOLUTE')
          assert.strictEqual(res.body.name, 'TypeError')
        })
        .end(done)
    })
  })

  describe('res.set()', function () {
    it('should have ERR_CONTENT_TYPE_ARRAY when setting Content-Type to array', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          res.set('Content-Type', ['text/html', 'text/plain'])
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_CONTENT_TYPE_ARRAY')
          assert.strictEqual(res.body.name, 'TypeError')
        })
        .end(done)
    })
  })

  describe('res.cookie()', function () {
    it('should have ERR_COOKIE_SECRET_REQUIRED for signed cookie without secret', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          res.cookie('name', 'value', { signed: true })
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_COOKIE_SECRET_REQUIRED')
          assert.strictEqual(res.body.name, 'Error')
        })
        .end(done)
    })
  })

  describe('req.get()', function () {
    it('should have ERR_HEADER_NAME_REQUIRED when name is missing', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          req.get()
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_HEADER_NAME_REQUIRED')
          assert.strictEqual(res.body.name, 'TypeError')
        })
        .end(done)
    })

    it('should have ERR_HEADER_NAME_NOT_STRING when name is not a string', function (done) {
      var app = express()

      app.use(function (req, res) {
        try {
          req.get(42)
        } catch (err) {
          res.status(500).json({ code: err.code, name: err.name })
        }
      })

      request(app)
        .get('/')
        .expect(500)
        .expect(function (res) {
          assert.strictEqual(res.body.code, 'ERR_HEADER_NAME_NOT_STRING')
          assert.strictEqual(res.body.name, 'TypeError')
        })
        .end(done)
    })
  })

  describe('app.use()', function () {
    it('should have ERR_MIDDLEWARE_REQUIRED when no middleware provided', function () {
      var app = express()

      try {
        app.use('/')
      } catch (err) {
        assert.strictEqual(err.code, 'ERR_MIDDLEWARE_REQUIRED')
        assert.strictEqual(err.name, 'TypeError')
        return
      }

      assert.fail('Expected error to be thrown')
    })
  })

  describe('app.engine()', function () {
    it('should have ERR_ENGINE_CALLBACK_REQUIRED when callback is not a function', function () {
      var app = express()

      try {
        app.engine('html', 'not a function')
      } catch (err) {
        assert.strictEqual(err.code, 'ERR_ENGINE_CALLBACK_REQUIRED')
        assert.strictEqual(err.name, 'Error')
        return
      }

      assert.fail('Expected error to be thrown')
    })
  })

  describe('app.set() configuration errors', function () {
    it('should have ERR_INVALID_ETAG_OPTION for invalid etag value', function () {
      var app = express()

      try {
        app.set('etag', 'invalid')
      } catch (err) {
        assert.strictEqual(err.code, 'ERR_INVALID_ETAG_OPTION')
        assert.strictEqual(err.name, 'TypeError')
        return
      }

      assert.fail('Expected error to be thrown')
    })

    it('should have ERR_INVALID_QUERY_PARSER_OPTION for invalid query parser value', function () {
      var app = express()

      try {
        app.set('query parser', 'invalid')
      } catch (err) {
        assert.strictEqual(err.code, 'ERR_INVALID_QUERY_PARSER_OPTION')
        assert.strictEqual(err.name, 'TypeError')
        return
      }

      assert.fail('Expected error to be thrown')
    })
  })
})
