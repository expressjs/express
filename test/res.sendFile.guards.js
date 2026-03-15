'use strict'

var assert = require('node:assert')
var EventEmitter = require('node:events').EventEmitter
var Module = require('node:module')

var responseModulePath = require.resolve('../lib/response')

function loadMockedResponse(sendMock, onFinishedMock) {
  var originalLoad = Module._load
  var savedCache = require.cache[responseModulePath]

  delete require.cache[responseModulePath]

  Module._load = function (request, parent, isMain) {
    if (request === 'send') return sendMock
    if (request === 'on-finished') return onFinishedMock
    return originalLoad.apply(this, arguments)
  }

  var mocked = require('../lib/response')

  Module._load = originalLoad

  if (savedCache) {
    require.cache[responseModulePath] = savedCache
  } else {
    delete require.cache[responseModulePath]
  }

  return mocked
}

function createMockRes(response) {
  var res = Object.create(response)
  res.req = {
    next: function () {}
  }
  res.app = {
    enabled: function () {
      return true
    }
  }
  res.setHeader = function () {}
  return res
}

function runScenario(setup, done) {
  var callbackCount = 0
  var callbackErr
  var file

  function sendMock() {
    file = new EventEmitter()
    file.pipe = function (res) {
      setup.pipe(file, res)
    }
    return file
  }

  function onFinishedMock(res, onfinish) {
    setup.onFinished(file, onfinish)
  }

  var response = loadMockedResponse(sendMock, onFinishedMock)
  var res = createMockRes(response)

  response.sendFile.call(res, '/tmp/fake.txt', function (err) {
    callbackCount++
    callbackErr = err || null
    setup.onCallback && setup.onCallback(err)
  })

  setImmediate(function () {
    setup.assert(callbackCount, callbackErr)
    done()
  })
}

describe('res.sendFile() internal guards', function () {
  it('should ignore ECONNRESET finish after already ended (onaborted done-guard)', function (done) {
    runScenario({
      pipe: function (file) {
        file.emit('end')
      },
      onFinished: function (file, onfinish) {
        setImmediate(function () {
          onfinish({ code: 'ECONNRESET' })
        })
      },
      assert: function (count, err) {
        assert.strictEqual(count, 1)
        assert.strictEqual(err, null)
      }
    }, done)
  })

  it('should ignore directory event after error (ondirectory done-guard)', function (done) {
    runScenario({
      pipe: function (file) {
        file.emit('error', new Error('boom'))
        file.emit('directory')
      },
      onFinished: function () {},
      assert: function (count, err) {
        assert.strictEqual(count, 1)
        assert.ok(err)
      }
    }, done)
  })

  it('should ignore error event after end (onerror done-guard)', function (done) {
    runScenario({
      pipe: function (file) {
        file.emit('end')
        file.emit('error', new Error('late error'))
      },
      onFinished: function () {},
      assert: function (count, err) {
        assert.strictEqual(count, 1)
        assert.strictEqual(err, null)
      }
    }, done)
  })

  it('should ignore end event after error (onend done-guard)', function (done) {
    runScenario({
      pipe: function (file) {
        file.emit('error', new Error('boom'))
        file.emit('end')
      },
      onFinished: function () {},
      assert: function (count, err) {
        assert.strictEqual(count, 1)
        assert.ok(err)
      }
    }, done)
  })

  it('should handle non-ECONNRESET finish errors via onerror', function (done) {
    runScenario({
      pipe: function () {},
      onFinished: function (file, onfinish) {
        onfinish({ code: 'EPIPE' })
      },
      assert: function (count, err) {
        assert.strictEqual(count, 1)
        assert.ok(err)
        assert.strictEqual(err.code, 'EPIPE')
      }
    }, done)
  })

  it('should skip finish completion when done before setImmediate', function (done) {
    runScenario({
      pipe: function (file) {
        file.emit('end')
      },
      onFinished: function (file, onfinish) {
        onfinish()
      },
      assert: function (count, err) {
        assert.strictEqual(count, 1)
        assert.strictEqual(err, null)
      }
    }, done)
  })
})
