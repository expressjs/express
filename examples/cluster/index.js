/*!
 * Express Cluster Example
 *
 * This example demonstrates how to use Express with clustering
 * to take advantage of multi-core systems.
 */

'use strict';

const express = require('../index.js');

// Example 1: Basic clustering with default settings
// This will create workers equal to the number of CPU cores
const clusteredApp = express({ cluster: true });

clusteredApp.get('/', (req, res) => {
  res.json({
    message: 'Hello from Express Cluster!',
    pid: process.pid,
    worker: 'This response was handled by a worker process'
  });
});

clusteredApp.get('/info', (req, res) => {
  res.json({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

clusteredApp.listen(3000, () => {
  console.log('Clustered Express app is ready on port 3000');
});

// Example 2: Custom number of workers
// Uncomment the lines below to try with a specific number of workers
/*
const customClusterApp = express({ cluster: true, numOfCpus: 2 });

customClusterApp.get('/', (req, res) => {
  res.json({
    message: 'Hello from Custom Cluster!',
    pid: process.pid,
    workers: 'Running with 2 workers only'
  });
});

customClusterApp.listen(3001, () => {
  console.log('Custom clustered Express app is ready on port 3001');
});
*/

// Example 3: Regular Express app (without clustering)
// Uncomment the lines below to compare with non-clustered version
/*
const regularApp = express();

regularApp.get('/', (req, res) => {
  res.json({
    message: 'Hello from Regular Express!',
    pid: process.pid,
    type: 'Single process (no clustering)'
  });
});

regularApp.listen(3002, () => {
  console.log('Regular Express app is ready on port 3002');
});
*/