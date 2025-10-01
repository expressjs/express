'use strict';

/**
 * Module dependencies.
 */

const cluster = require('node:cluster');
const os = require('node:os');

/**
 * Initialize cluster mode for Express
 * @param {Object} options - Cluster configuration options
 * @param {number} options.numOfCpus - Number of workers to spawn (default: os.cpus().length)
 * @param {Function} app - Express application instance
 * @returns {Object} - Express application or cluster manager
 */
exports.initCluster = function (options, app) {
  options = options || {};
  const numCPUs = (options.numOfCpus && options.numOfCpus > 0) ? options.numOfCpus : os.cpus().length;

  if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers based on numOfCpus
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
      cluster.fork(); // Replace the dead worker
    });

    // Return a proxy object for the primary that mimics the Express app interface
    const primaryApp = {
      listen: function () {
        console.log(`Express running in cluster mode with ${numCPUs} workers`);
        return this;
      }
    };

    // Add method proxies to maintain the Express app interface in primary
    ['get', 'post', 'put', 'delete', 'patch', 'use', 'set', 'engine', 'all'].forEach(method => {
      primaryApp[method] = function () {
        // Store the configuration to be applied by workers
        return this;
      };
    });

    return primaryApp;
  }

  // Worker processes use the regular Express app
  console.log(`Worker ${process.pid} started`);
  return app;
};
