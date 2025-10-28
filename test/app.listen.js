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

  describe('ASCII logo', function() {
    it('should not print ASCII logo by default', function(done) {
      const app = express();
      const originalLog = console.log;
      let logOutput = '';

      console.log = function(...args) {
        logOutput += args.join(' ');
      };

      const server = app.listen(0, function() {
        console.log = originalLog;
        assert(!logOutput.includes('│ __│'), 'ASCII logo should not be printed by default');
        server.close(done);
      });
    });

    it('should print ASCII logo when enabled', function(done) {
      const app = express();
      app.enable('ascii logo');

      const originalLog = console.log;
      let logOutput = '';

      console.log = function(...args) {
        logOutput += args.join(' ');
      };

      const server = app.listen(0, function() {
        console.log = originalLog;
        assert(logOutput.includes('│ __│'), 'ASCII logo should be printed when enabled');
        server.close(done);
      });
    });

    it('should not print ASCII logo when disabled', function(done) {
      const app = express();
      app.enable('ascii logo');
      app.disable('ascii logo');

      const originalLog = console.log;
      let logOutput = '';

      console.log = function(...args) {
        logOutput += args.join(' ');
      };

      const server = app.listen(0, function() {
        console.log = originalLog;
        assert(!logOutput.includes('│ __│'), 'ASCII logo should not be printed when disabled');
        server.close(done);
      });
    });
  });
})
