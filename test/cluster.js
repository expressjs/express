'use strict'

var assert = require('node:assert')
var cluster = require('node:cluster')
var os = require('node:os')
var clusterManager = require('../lib/cluster')

describe('cluster module', function () {
  var originalIsPrimary;
  var originalCpus;
  var originalFork;
  var originalOn;

  beforeEach(function () {
    // Store original values
    originalIsPrimary = cluster.isPrimary;
    originalCpus = os.cpus;
    originalFork = cluster.fork;
    originalOn = cluster.on;
  });

  afterEach(function () {
    // Restore original values
    cluster.isPrimary = originalIsPrimary;
    os.cpus = originalCpus;
    cluster.fork = originalFork;
    cluster.on = originalOn;
  });

  describe('initCluster', function () {
    it('should be a function', function () {
      assert.equal(typeof clusterManager.initCluster, 'function');
    })

    describe('in primary process', function () {
      var mockWorkers = [];
      var mockEvents = {};

      beforeEach(function () {
        cluster.isPrimary = true;
        mockWorkers = [];
        mockEvents = {};

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
          mockEvents[event] = callback;
        };

        os.cpus = function () {
          return [
            { model: 'CPU1' },
            { model: 'CPU2' }
          ];
        };
      });

      it('should return primary app proxy when in primary process', function () {
        var mockApp = { init: function () { } };
        var result = clusterManager.initCluster({}, mockApp);

        assert.equal(typeof result, 'object');
        assert.equal(typeof result.listen, 'function');
        assert.notStrictEqual(result, mockApp);
      })

      it('should fork workers equal to CPU count by default', function () {
        var mockApp = { init: function () { } };
        clusterManager.initCluster({}, mockApp);

        assert.equal(mockWorkers.length, 2);
      })

      it('should fork custom number of workers when specified', function () {
        var mockApp = { init: function () { } };
        clusterManager.initCluster({ numOfCpus: 4 }, mockApp);

        assert.equal(mockWorkers.length, 4);
      })

      it('should register exit event handler', function () {
        var mockApp = { init: function () { } };
        clusterManager.initCluster({}, mockApp);

        assert.equal(typeof mockEvents.exit, 'function');
      })

      it('should restart worker on exit', function () {
        var mockApp = { init: function () { } };
        var forkCount = 0;
        var originalClusterFork = cluster.fork;

        cluster.fork = function () {
          forkCount++;
          return originalClusterFork.call(this);
        };

        clusterManager.initCluster({ numOfCpus: 1 }, mockApp);

        // Initial fork
        assert.equal(forkCount, 1);

        // Simulate worker exit
        if (mockEvents.exit) {
          mockEvents.exit(mockWorkers[0], 1, 'SIGTERM');
          assert.equal(forkCount, 2); // Should fork replacement
        }
      })

      it('should have all express method proxies', function () {
        var mockApp = { init: function () { } };
        var result = clusterManager.initCluster({}, mockApp);

        var methods = ['get', 'post', 'put', 'delete', 'patch', 'use', 'set', 'engine', 'all'];
        methods.forEach(function (method) {
          assert.equal(typeof result[method], 'function');
        });
      })

      it('should return chainable proxy methods', function () {
        var mockApp = { init: function () { } };
        var result = clusterManager.initCluster({}, mockApp);

        var chainResult = result.get('/test', function () { });
        assert.strictEqual(chainResult, result);

        chainResult = result.use(function () { });
        assert.strictEqual(chainResult, result);
      })

      it('should have listen method that returns itself', function () {
        var mockApp = { init: function () { } };
        var result = clusterManager.initCluster({}, mockApp);

        var listenResult = result.listen(3000);
        assert.strictEqual(listenResult, result);
      })
    })

    describe('in worker process', function () {
      beforeEach(function () {
        cluster.isPrimary = false;
      });

      it('should return original app when in worker process', function () {
        var mockApp = {
          init: function () { },
          listen: function () { },
          get: function () { }
        };

        var result = clusterManager.initCluster({}, mockApp);
        assert.strictEqual(result, mockApp);
      })

      it('should not fork workers in worker process', function () {
        var forkCalled = false;
        cluster.fork = function () {
          forkCalled = true;
        };

        var mockApp = { init: function () { } };
        clusterManager.initCluster({}, mockApp);

        assert.equal(forkCalled, false);
      })
    })

    describe('edge cases', function () {
      beforeEach(function () {
        cluster.isPrimary = true;
        cluster.fork = function () {
          return { process: { pid: 12345 } };
        };
        cluster.on = function () { };
        os.cpus = function () {
          return [{ model: 'CPU1' }];
        };
      });

      it('should handle options without numOfCpus', function () {
        var mockApp = { init: function () { } };
        var result = clusterManager.initCluster({}, mockApp);

        assert.equal(typeof result, 'object');
        assert.equal(typeof result.listen, 'function');
      })

      it('should handle null options', function () {
        var mockApp = { init: function () { } };
        var result = clusterManager.initCluster(null, mockApp);

        assert.equal(typeof result, 'object');
      })

      it('should handle undefined options', function () {
        var mockApp = { init: function () { } };
        var result = clusterManager.initCluster(undefined, mockApp);

        assert.equal(typeof result, 'object');
      })

      it('should handle zero numOfCpus', function () {
        var mockApp = { init: function () { } };
        var forkCount = 0;

        cluster.fork = function () {
          forkCount++;
          return { process: { pid: 12345 } };
        };

        clusterManager.initCluster({ numOfCpus: 0 }, mockApp);

        // Should use os.cpus().length as fallback (which is 1 in our mock)
        assert.equal(forkCount, 1);
      })

      it('should handle negative numOfCpus', function () {
        var mockApp = { init: function () { } };
        var forkCount = 0;

        cluster.fork = function () {
          forkCount++;
          return { process: { pid: 12345 } };
        };

        clusterManager.initCluster({ numOfCpus: -1 }, mockApp);

        // Should still use os.cpus().length as fallback (which is 1 in our mock)
        assert.equal(forkCount, 1);
      })
    })
  })
})