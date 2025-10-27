/*!
 * express - Production-Ready Clustering
 * Zero-configuration multi-core support
 * Copyright(c) 2025
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

const cluster = require('cluster');
const os = require('os');
const process = require('node:process');

/**
 * Default options
 * @private
 */

const defaultOptions = {
  workers: process.env.CLUSTER_WORKERS || os.cpus().length,
  respawn: true,
  respawnDelay: 1000,
  killTimeout: 10000,
  verbose: process.env.NODE_ENV !== 'production',
  gracefulShutdown: true
};

/**
 * Create a clustered Express application
 *
 * @param {Function} createApp - Function that creates and returns Express app
 * @param {Object} options - Clustering options
 * @return {Object} Cluster manager or app instance
 * @public
 */

function createCluster(createApp, options) {
  options = Object.assign({}, defaultOptions, options || {});

  if (cluster.isPrimary) {
    return startPrimary(createApp, options);
  } else {
    return startWorker(createApp, options);
  }
}

/**
 * Start primary process
 *
 * @param {Function} createApp
 * @param {Object} options
 * @return {Object} Cluster manager
 * @private
 */

function startPrimary(createApp, options) {
  const workers = {};
  let stopping = false;

  function log(message) {
    if (options.verbose) {
      console.log(`[Cluster Primary ${process.pid}] ${message}`);
    }
  }

  function forkWorker() {
    const worker = cluster.fork();
    workers[worker.id] = worker;

    worker.on('online', () => {
      log(`Worker ${worker.id} (PID ${worker.process.pid}) online`);
    });

    worker.on('exit', (code, signal) => {
      delete workers[worker.id];

      if (!stopping && options.respawn) {
        log(`Worker ${worker.id} died (${signal || code}). Respawning in ${options.respawnDelay}ms...`);
        setTimeout(forkWorker, options.respawnDelay);
      } else {
        log(`Worker ${worker.id} exited (${signal || code})`);
      }
    });

    return worker;
  }

  // Fork initial workers
  log(`Starting ${options.workers} workers...`);
  for (let i = 0; i < options.workers; i++) {
    forkWorker();
  }

  // Graceful shutdown handler
  function gracefulShutdown(signal) {
    if (stopping) return;
    stopping = true;

    log(`Received ${signal}. Shutting down gracefully...`);

    // Stop accepting new workers
    cluster.removeAllListeners('exit');

    // Kill all workers
    const workerIds = Object.keys(workers);
    if (workerIds.length === 0) {
      log('No workers to kill. Exiting.');
      process.exit(0);
      return;
    }

    log(`Killing ${workerIds.length} workers...`);

    workerIds.forEach(id => {
      const worker = workers[id];
      if (worker) {
        worker.kill('SIGTERM');
      }
    });

    // Force kill after timeout
    const killTimer = setTimeout(() => {
      log(`Force killing remaining workers after ${options.killTimeout}ms`);
      workerIds.forEach(id => {
        const worker = workers[id];
        if (worker && worker.isConnected()) {
          worker.kill('SIGKILL');
        }
      });
      process.exit(1);
    }, options.killTimeout);

    // Wait for all workers to exit
    const checkInterval = setInterval(() => {
      if (Object.keys(workers).length === 0) {
        clearTimeout(killTimer);
        clearInterval(checkInterval);
        log('All workers exited. Shutting down primary.');
        process.exit(0);
      }
    }, 100);
  }

  // Register signal handlers
  if (options.gracefulShutdown) {
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }

  log('Cluster manager started');

  return {
    workers: workers,
    shutdown: gracefulShutdown,
    isPrimary: true
  };
}

/**
 * Start worker process
 *
 * @param {Function} createApp
 * @param {Object} options
 * @return {Object} Worker app
 * @private
 */

function startWorker(createApp, options) {
  function log(message) {
    if (options.verbose) {
      console.log(`[Cluster Worker ${process.pid}] ${message}`);
    }
  }

  log('Worker starting...');

  const app = createApp();

  // Graceful shutdown for worker
  if (options.gracefulShutdown) {
    let server;

    // Capture server instance when listen is called
    const originalListen = app.listen;
    app.listen = function(...args) {
      server = originalListen.apply(this, args);
      return server;
    };

    process.on('SIGTERM', () => {
      log('Received SIGTERM. Closing connections...');

      if (server) {
        server.close(() => {
          log('Server closed. Exiting.');
          process.exit(0);
        });

        // Force exit after timeout
        setTimeout(() => {
          log('Force exit after timeout');
          process.exit(1);
        }, options.killTimeout);
      } else {
        process.exit(0);
      }
    });
  }

  return app;
}

/**
 * Module exports.
 * @public
 */

module.exports = createCluster;
module.exports.createCluster = createCluster;
