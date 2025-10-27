/*!
 * Express - Clustered Hyper-Optimized Server
 * Use all CPU cores for maximum throughput
 */

"use strict";

const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log("╔═══════════════════════════════════════════╗");
  console.log("║  Express - CLUSTERED Hyper-Optimized     ║");
  console.log("╚═══════════════════════════════════════════╝");
  console.log("");
  console.log(`🚀 Primary process ${process.pid} is running`);
  console.log(`💪 Starting ${numCPUs} worker processes...`);
  console.log("");

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    console.log(
      `   ✅ Worker ${i + 1}/${numCPUs} started (PID: ${worker.process.pid})`
    );
  }

  console.log("");
  console.log("📊 Expected Performance:");
  console.log(`   Single core: ~24,000 req/s`);
  console.log(
    `   ${numCPUs} cores:   ~${(24000 * numCPUs * 0.85) / 1000}k-${
      (24000 * numCPUs * 0.95) / 1000
    }k req/s`
  );
  console.log("");
  console.log("🔥 Benchmark Commands:");
  console.log(`   wrk -c 400 -d 30s -t 8 http://localhost:3000/json`);
  console.log(`   autocannon -c 1000 -d 30 http://localhost:3000/json`);
  console.log("");
  console.log("💡 Use more connections for clustered mode!");
  console.log("");

  // Worker management
  cluster.on("online", (worker) => {
    console.log(`✅ Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`⚠️  Worker ${worker.process.pid} died (${signal || code})`);
    console.log("🔄 Starting replacement worker...");
    const newWorker = cluster.fork();
    console.log(`✅ New worker started (PID: ${newWorker.process.pid})`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("\n🛑 SIGTERM received, shutting down gracefully...");
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });
} else {
  // Worker process - load the hyper-optimized server
  require("../benchmarks/hyper-optimized.js");

  console.log(`Worker ${process.pid} started`);
}
