'use strict'

var express = require('../')
var assert = require('node:assert')

describe('app.listen()', function(){
  it('should wrap with an HTTP server', function(done){
    var app = express();

    var server = app.listen(0, function () {
      server.close(done)
    });
  })
  it('should callback on HTTP server errors', function (done) {
    var app1 = express()
    var app2 = express()

    var server1 = app1.listen(0, function (err) {
      assert(!err)
      app2.listen(server1.address().port, function (err) {
        assert(err.code === 'EADDRINUSE')
        server1.close()
        done()
      })
    })
  })
  it('should remove the listen error handler after a successful start', function (done) {
    var app = express()

    var server = app.listen(0, function () {
      var errorListeners = server.listenerCount('error')
      server.close(function (err) {
        assert.ifError(err)
        assert.strictEqual(errorListeners, 0)
        done()
      })
    })
  })
  it('should not retain the listen error handler when listening again fails', function (done) {
    var app = express()

    var server = app.listen(0, '127.0.0.1', function (err) {
      if (err) return done(err)

      server.close(function (err) {
        if (err) return done(err)

        var blocker = app.listen(0, '127.0.0.1', function (err) {
          if (err) return done(err)

          // Inspect remaining listeners before any stale one-off listener runs.
          server.prependOnceListener('error', function (err) {
            var errorListeners = server.listenerCount('error')

            blocker.close(function (closeErr) {
              assert.ifError(closeErr)
              assert.strictEqual(err.code, 'EADDRINUSE')
              assert.strictEqual(errorListeners, 0)
              done()
            })
          })

          server.listen(blocker.address().port, '127.0.0.1')
        })
      })
    })
  })
  it('accepts port + hostname + backlog + callback', function (done) {
    const app = express();
    const server = app.listen(0, '127.0.0.1', 5, function () {
      const { address, port } = server.address();
      assert.strictEqual(address, '127.0.0.1');
      assert(Number.isInteger(port) && port > 0);
      // backlog isn’t directly inspectable, but if no error was thrown
      // we know it was accepted.
      server.close(done);
    });
  });
  it('accepts just a callback (no args)', function (done) {
    const app = express();
    // same as app.listen(0, done)
    const server = app.listen();
    server.close(done);
  });

  it('should not invoke callback more than once', function (done) {
    var app = express()
    var count = 0
    var server = app.listen(0, function () {
      count++
    })

    server.once('listening', function () {
      server.emit('error', new Error('boom'))
      server.close(function (err) {
        assert.ifError(err)
        assert.strictEqual(count, 1)
        done()
      })
    })
  })

  it('server.address() gives a { address, port, family } object', function (done) {
    const app = express();
    const server = app.listen(0, () => {
      const addr = server.address();
      assert(addr && typeof addr === 'object');
      assert.strictEqual(typeof addr.address, 'string');
      assert(Number.isInteger(addr.port) && addr.port > 0);
      assert(typeof addr.family === 'string');
      server.close(done);
    });
  });
})
