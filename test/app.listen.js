'use strict'

const express = require('../')
const assert = require('node:assert')

describe('app.listen()', () => {
  it('should wrap with an HTTP server', (done) => {
    const app = express()

    const server = app.listen(0, () => {
      server.close(done)
    })
  })
  it('should callback on HTTP server errors', (done) => {
    const app1 = express()
    const app2 = express()

    const server1 = app1.listen(0, (err) => {
      assert(!err)
      app2.listen(server1.address().port, (err) => {
        assert(err.code === 'EADDRINUSE')
        server1.close()
        done()
      })
    })
  })
  it('accepts port + hostname + backlog + callback', (done) => {
    const app = express()
    const server = app.listen(0, '127.0.0.1', 5, () => {
      const { address, port } = server.address()
      assert.strictEqual(address, '127.0.0.1')
      assert(Number.isInteger(port) && port > 0)
      // backlog isn’t directly inspectable, but if no error was thrown
      // we know it was accepted.
      server.close(done)
    })
  })
  it('accepts just a callback (no args)', (done) => {
    const app = express()
    // same as app.listen(0, done)
    const server = app.listen()
    server.close(done)
  })
  it('server.address() gives a { address, port, family } object', (done) => {
    const app = express()
    const server = app.listen(0, () => {
      const addr = server.address()
      assert(addr && typeof addr === 'object')
      assert.strictEqual(typeof addr.address, 'string')
      assert(Number.isInteger(addr.port) && addr.port > 0)
      assert(typeof addr.family === 'string')
      server.close(done)
    })
  })
})
