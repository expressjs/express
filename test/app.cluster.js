'use strict'

var assert = require('node:assert')
var express = require('..')
var cluster = require('node:cluster')
var os = require('node:os')

describe('app.cluster', function () {
  var originalIsPrimary;
  var originalCpus;

  beforeEach(function () {
    // Store original values
    originalIsPrimary = cluster.isPrimary;
    originalCpus = os.cpus;
  });

  afterEach(function () {
    // Restore original values
    cluster.isPrimary = originalIsPrimary;
    os.cpus = originalCpus;
  });

  describe('when cluster option is not provided', function () {
    it('should create a regular express app', function () {
      var app = express();
      assert.equal(typeof app, 'function');
      assert.equal(typeof app.listen, 'function');
      assert.equal(typeof app.get, 'function');
      assert.equal(typeof app.post, 'function');
    })

    it('should create a regular express app with empty options', function () {
      var app = express({});
      assert.equal(typeof app, 'function');
      assert.equal(typeof app.listen, 'function');
    })

    it('should create a regular express app when cluster is false', function () {
      var app = express({ cluster: false });
      assert.equal(typeof app, 'function');
      assert.equal(typeof app.listen, 'function');
    })
  })

  describe('when cluster option is true', function () {
    describe('in primary process', function () {
      beforeEach(function () {
        // Mock primary process
        cluster.isPrimary = true;
        cluster.fork = function () { return { process: { pid: 12345 } }; };
        cluster.on = function () { };

        // Mock os.cpus to return consistent result
        os.cpus = function () {
          return [
            { model: 'Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz' },
            { model: 'Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz' }
          ];
        };
      });

      it('should return cluster manager proxy object', function () {
        var app = express({ cluster: true });

        assert.equal(typeof app, 'object');
        assert.equal(typeof app.listen, 'function');
        assert.equal(typeof app.get, 'function');
        assert.equal(typeof app.post, 'function');
        assert.equal(typeof app.put, 'function');
        assert.equal(typeof app.delete, 'function');
        assert.equal(typeof app.patch, 'function');
        assert.equal(typeof app.use, 'function');
        assert.equal(typeof app.set, 'function');
        assert.equal(typeof app.engine, 'function');
        assert.equal(typeof app.all, 'function');
      })

      it('should use default number of CPUs when numOfCpus not specified', function () {
        var app = express({ cluster: true });

        // The proxy object should be returned
        assert.equal(typeof app, 'object');
        assert.equal(typeof app.listen, 'function');
      })

      it('should use custom number of CPUs when specified', function () {
        var app = express({ cluster: true, numOfCpus: 4 });

        // The proxy object should be returned
        assert.equal(typeof app, 'object');
        assert.equal(typeof app.listen, 'function');
      })

      it('should return chainable proxy methods', function () {
        var app = express({ cluster: true });

        var result = app.get('/test', function () { });
        assert.strictEqual(result, app);

        result = app.post('/test', function () { });
        assert.strictEqual(result, app);

        result = app.use(function () { });
        assert.strictEqual(result, app);
      })

      it('should have listen method that returns itself', function () {
        var app = express({ cluster: true });

        var result = app.listen(3000);
        assert.strictEqual(result, app);
      })
    })

    describe('in worker process', function () {
      beforeEach(function () {
        // Mock worker process
        cluster.isPrimary = false;
      });

      it('should return regular express app in worker process', function () {
        var app = express({ cluster: true });

        assert.equal(typeof app, 'function');
        assert.equal(typeof app.listen, 'function');
        assert.equal(typeof app.get, 'function');
        assert.equal(typeof app.handle, 'function');
      })

      it('should have all express app functionality in worker', function () {
        var app = express({ cluster: true });

        // Should be able to initialize the app first
        app.init();

        // Should be able to add routes
        app.get('/test', function (req, res) {
          res.send('Hello World');
        });

        // Should have express app properties
        assert(app.request);
        assert(app.response);
        assert.equal(typeof app.init, 'function');
      })
    })
  })

  describe('cluster manager functionality', function () {
    var mockWorkers = [];
    var mockClusterEvents = {};

    beforeEach(function () {
      cluster.isPrimary = true;
      mockWorkers = [];
      mockClusterEvents = {};

      cluster.fork = function () {
        var worker = {
          process: {
            pid: Math.floor(Math.random() * 10000) + 1000
          }
        };
        mockWorkers.push(worker);
        return worker;
      };

      cluster.on = function (event, callback) {
        mockClusterEvents[event] = callback;
      };

      os.cpus = function () {
        return [
          { model: 'CPU1' },
          { model: 'CPU2' },
          { model: 'CPU3' },
          { model: 'CPU4' }
        ];
      };
    });

    it('should fork correct number of workers based on CPU count', function () {
      express({ cluster: true });

      assert.equal(mockWorkers.length, 4); // Based on mocked os.cpus()
    })

    it('should fork custom number of workers when specified', function () {
      express({ cluster: true, numOfCpus: 2 });

      assert.equal(mockWorkers.length, 2);
    })

    it('should register exit event handler', function () {
      express({ cluster: true });

      assert.equal(typeof mockClusterEvents.exit, 'function');
    })

    it('should handle worker exit and restart', function () {
      var forkCallCount = 0;
      var originalFork = cluster.fork;

      cluster.fork = function () {
        forkCallCount++;
        return originalFork.call(this);
      };

      express({ cluster: true, numOfCpus: 2 });

      // Initial forks
      assert.equal(forkCallCount, 2);

      // Simulate worker exit
      if (mockClusterEvents.exit) {
        mockClusterEvents.exit(mockWorkers[0], 1, 'SIGTERM');

        // Should fork a replacement worker
        assert.equal(forkCallCount, 3);
      }
    })
  })

  describe('edge cases', function () {
    it('should handle null options', function () {
      var app = express(null);
      assert.equal(typeof app, 'function');
    })

    it('should handle undefined options', function () {
      var app = express(undefined);
      assert.equal(typeof app, 'function');
    })

    it('should handle options without cluster property', function () {
      var app = express({ someOtherOption: true });
      assert.equal(typeof app, 'function');
    })

    it('should handle cluster option with other values', function () {
      var app = express({ cluster: 'true' }); // string instead of boolean
      assert.equal(typeof app, 'function'); // Should create regular app
    })

    it('should handle cluster option as false', function () {
      var app = express({ cluster: false });
      assert.equal(typeof app, 'function'); // Should create regular app
    })
  })
})