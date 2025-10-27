/*!
 * Express - Cluster Mode
 * Optimize for multi-core CPUs
 * Copyright(c) 2025
 * MIT Licensed
 */

"use strict";

const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numWorkers = process.env.CLUSTER_WORKERS || os.cpus().length;

  console.log(
    `[Cluster] Master ${process.pid} starting ${numWorkers} workers...`
  );

  // Fork workers
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  // Worker exit handler - restart automatically
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `[Cluster] Worker ${worker.process.pid} died (${
        signal || code
      }). Restarting...`
    );
    cluster.fork();
  });

  // Worker online handler
  cluster.on("online", (worker) => {
    console.log(`[Cluster] Worker ${worker.process.pid} is online`);
  });
} else {
  // Worker processes have their own Express app
  require("../examples/hello-world/index.js");
}
