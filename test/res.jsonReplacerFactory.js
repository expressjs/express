'use strict'

var assert = require('node:assert')
var Buffer = require('node:buffer').Buffer
var express = require('../')
var request = require('supertest')

var transports = [
  { name: 'json', method: 'json' },
  { name: 'jsonp without callback', method: 'jsonp' },
  { name: 'jsonp with callback', method: 'jsonp', callback: true },
  { name: 'send object', method: 'send' }
]

transports.forEach(function (transport) {
  describe('json replacer factory: ' + transport.name, function () {
    function get(app, path) {
      return request(app).get((path || '/') + (transport.callback ? '?callback=cb' : ''))
    }

    function body(json) {
      return transport.callback
        ? '/**/ typeof cb === \'function\' && cb(' + json + ');'
        : json
    }

    it('keeps the existing replacer when no factory is configured', function () {
      var app = express()
      app.set('json replacer', ['name'])
      app.use(function (req, res) {
        res[transport.method]({ name: 'tobi', extra: true })
      })
      return get(app).expect(200, body('{"name":"tobi"}'))
    })

    it('creates a replacer once with the actual request and response', function () {
      var app = express()
      var calls = 0
      var response
      app.set('json replacer factory', function (req, res) {
        calls++
        assert.strictEqual(res, response)
        assert.strictEqual(req, res.req)
        return function (key, value) {
          assert.strictEqual(req.app, app)
          assert.strictEqual(res.app, app)
          return key === 'message' ? res.locals.prefix + value : value
        }
      })
      app.use(function (req, res) {
        response = res
        res.locals.prefix = req.get('X-Prefix')
        assert.strictEqual(res[transport.method]({ message: 'hello' }), res)
      })
      return get(app).set('X-Prefix', 'one:').expect(200, body('{"message":"one:hello"}'))
        .then(function () { assert.strictEqual(calls, 1) })
    })

    it('preserves the root holder, nested holder and toJSON semantics', function () {
      var app = express()
      var nested = { value: 2 }
      var payload = { nested: nested, custom: { toJSON: function () { return 3 } } }
      var rootSeen = false
      var nestedSeen = false
      var customSeen = false
      app.set('json replacer factory', function () {
        return function (key, value) {
          if (key === '') {
            rootSeen = true
            assert.strictEqual(this[''], payload)
          }
          if (key === 'value') {
            nestedSeen = true
            assert.strictEqual(this, nested)
          }
          if (key === 'custom') {
            customSeen = true
            assert.strictEqual(value, 3)
          }
          return value
        }
      })
      app.use(function (req, res) { res[transport.method](payload) })
      return get(app).expect(200, body('{"nested":{"value":2},"custom":3}'))
        .then(function () { assert(rootSeen && nestedSeen && customSeen) })
    })

    it('accepts an array replacer and overrides the legacy replacer', function () {
      var app = express()
      app.set('json replacer', ['extra'])
      app.set('json replacer factory', function () { return ['name', 'nested'] })
      app.use(function (req, res) {
        res[transport.method]({ name: 'tobi', nested: { name: 'loki', extra: true }, extra: true })
      })
      return get(app).expect(200, body('{"name":"tobi","nested":{"name":"loki"}}'))
    })

    ;[null, undefined].forEach(function (replacer) {
      it('uses native serialization when the factory returns ' + replacer, function () {
        var app = express()
        app.set('json replacer', ['different'])
        app.set('json replacer factory', function () { return replacer })
        app.use(function (req, res) { res[transport.method]({ name: 'tobi' }) })
        return get(app).expect(200, body('{"name":"tobi"}'))
      })
    })

    it('preserves json spaces and json escape', function () {
      var app = express()
      app.set('json spaces', 2)
      app.enable('json escape')
      app.set('json replacer factory', function () {
        return function (key, value) { return key === 'name' ? '<tobi>&' : value }
      })
      app.use(function (req, res) { res[transport.method]({ name: 'tobi' }) })
      return get(app).expect(200, body('{\n  "name": "\\u003ctobi\\u003e\\u0026"\n}'))
    })

    it('isolates each response without changing application settings', function () {
      var app = express()
      var legacy = ['legacy']
      var factory = function (req) {
        var prefix = req.get('X-Prefix')
        return function (key, value) { return key === 'name' ? prefix + value : value }
      }
      app.set('json replacer', legacy)
      app.set('json replacer factory', factory)
      app.use(function (req, res) { res[transport.method]({ name: 'tobi' }) })
      return get(app).set('X-Prefix', 'a:').expect(200, body('{"name":"a:tobi"}'))
        .then(function () {
          assert.strictEqual(app.get('json replacer'), legacy)
          assert.strictEqual(app.get('json replacer factory'), factory)
          return get(app).set('X-Prefix', 'b:').expect(200, body('{"name":"b:tobi"}'))
        })
    })

    it('inherits a parent factory and permits a child to disable it', function () {
      var app = express()
      var child = express()
      var disabled = express()
      app.set('json replacer', ['name'])
      app.set('json replacer factory', function () { return ['extra'] })
      disabled.set('json replacer factory', null)
      child.use(function (req, res) { res[transport.method]({ name: 'tobi', extra: true }) })
      disabled.use(function (req, res) { res[transport.method]({ name: 'tobi', extra: true }) })
      app.use('/inherited', child)
      app.use('/disabled', disabled)
      return get(app, '/inherited').expect(200, body('{"extra":true}'))
        .then(function () { return get(app, '/disabled').expect(200, body('{"name":"tobi"}')) })
    })

    it('permits a child factory to override its parent', function () {
      var app = express()
      var child = express()
      app.set('json replacer factory', function () { return ['extra'] })
      child.set('json replacer factory', function () { return ['name'] })
      child.use(function (req, res) { res[transport.method]({ name: 'tobi', extra: true }) })
      app.use(child)
      return get(app).expect(200, body('{"name":"tobi"}'))
    })

    it('keeps context isolated when responses finish in reverse request order', function () {
      var app = express()
      var ready
      var firstReady = new Promise(function (resolve) { ready = resolve })
      var releaseFirst
      app.set('json replacer factory', function (req, res) {
        return function (key, value) { return key === 'name' ? res.locals.prefix + value : value }
      })
      app.get('/first', function (req, res) {
        res.locals.prefix = 'first:'
        releaseFirst = function () { res[transport.method]({ name: 'tobi' }) }
        ready()
      })
      app.get('/second', function (req, res) {
        res.locals.prefix = 'second:'
        res[transport.method]({ name: 'tobi' })
        releaseFirst()
      })
      var first = get(app, '/first').expect(200, body('{"name":"first:tobi"}')).then(function () {})
      return firstReady.then(function () {
        return Promise.all([first, get(app, '/second').expect(200, body('{"name":"second:tobi"}'))])
      })
    })

    it('supports replacers that remove the root value', function () {
      var app = express()
      app.set('json replacer factory', function () { return function () {} })
      app.use(function (req, res) { res[transport.method]({ name: 'tobi' }) })
      return get(app).expect(200, transport.callback ? '/**/ typeof cb === \'function\' && cb();' : '')
    })

    it('formats objects nested inside an array response', function () {
      var app = express()
      app.set('json replacer factory', function () {
        return function (key, value) { return key === 'name' ? value.toUpperCase() : value }
      })
      app.use(function (req, res) { res[transport.method]([{ name: 'tobi' }]) })
      return get(app).expect(200, body('[{"name":"TOBI"}]'))
    })

    it('uses the formatted bytes for HEAD metadata and conditional responses', function () {
      var app = express()
      var expected = body('{"name":"TOBÍ"}')
      var etag
      app.set('json replacer factory', function () {
        return function (key, value) { return key === 'name' ? value.toUpperCase() : value }
      })
      app.use(function (req, res) { res[transport.method]({ name: 'tobí' }) })
      return get(app).expect(200, expected)
        .then(function (response) {
          etag = response.headers.etag
          assert(etag)
          return request(app).head('/' + (transport.callback ? '?callback=cb' : ''))
            .expect(200)
            .expect('Content-Length', String(Buffer.byteLength(expected)))
            .expect('ETag', etag)
            .expect(function (head) { assert.strictEqual(head.text, undefined) })
        })
        .then(function () { return get(app).set('If-None-Match', etag).expect(304, '') })
    })

    ;['factory', 'replacer'].forEach(function (origin) {
      it('forwards ' + origin + ' errors before sending headers', function () {
        var app = express()
        var error = new Error('formatter failed')
        function fail() { throw error }
        app.set('json replacer factory', origin === 'factory' ? fail : function () { return fail })
        app.use(function (req, res) { res[transport.method]({ name: 'tobi' }) })
        app.use(function (err, req, res, next) {
          assert.strictEqual(err, error)
          assert.strictEqual(res.headersSent, false)
          res.status(500).send('formatter failed')
        })
        return get(app).expect(500, 'formatter failed')
      })
    })

    ;[false, 0, 'invalid', {}, Promise.resolve(null)].forEach(function (invalid, index) {
      it('rejects invalid factory result ' + index + ' before sending headers', function () {
        var app = express()
        app.set('json replacer factory', function () { return invalid })
        app.use(function (req, res) { res[transport.method]({ name: 'tobi' }) })
        app.use(function (err, req, res, next) {
          assert(err instanceof TypeError)
          assert.strictEqual(res.headersSent, false)
          res.status(500).send(err.message)
        })
        return get(app).expect(500, 'json replacer factory must return a function, array, null or undefined')
      })
    })

    it('rejects a configured factory that is not a function', function () {
      var app = express()
      app.set('json replacer factory', false)
      app.use(function (req, res) { res[transport.method]({ name: 'tobi' }) })
      app.use(function (err, req, res, next) {
        assert(err instanceof TypeError)
        assert.strictEqual(res.headersSent, false)
        res.status(500).send(err.message)
      })
      return get(app).expect(500, 'json replacer factory must be a function')
    })
  })
})
