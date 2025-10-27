/*!
 * Express - Zero-Config Clustering Example
 * Production-ready multi-core support with ZERO configuration!
 */

"use strict";

const express = require("../..");

// Create your Express app as a function
function createApp() {
  const app = express();

  // Your normal Express code - no changes needed!
  app.get("/", (req, res) => {
    res.send(`Hello from worker ${process.pid}!`);
  });

  app.get("/json", (req, res) => {
    res.json({
      worker: process.pid,
      message: "Hello World",
      timestamp: Date.now(),
    });
  });

  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      worker: process.pid,
      uptime: process.uptime(),
    });
  });

  return app;
}

// Option 1: Manual clustering (you control when to cluster)
if (require.main === module) {
  // Use clustering in production, single process in development
  if (process.env.CLUSTER === "true" || process.env.NODE_ENV === "production") {
    // Zero-config clustering - automatically uses all CPU cores!
    const cluster = express.cluster(createApp);

    if (cluster.isPrimary) {
      console.log("🚀 Clustered Express server started!");
      console.log(`   Workers: ${require("os").cpus().length}`);
      console.log(`   Primary PID: ${process.pid}`);
      console.log("");
      console.log("   Server will start on http://localhost:3000");
      console.log("");
      console.log("   Press Ctrl+C to stop");
    } else {
      // Worker process - start the server
      cluster.listen(3000);
      console.log(`Worker ${process.pid} started`);
    }
  } else {
    // Development mode - single process
    const app = createApp();
    app.listen(3000, () => {
      console.log(
        "Express server (development) listening on http://localhost:3000"
      );
      console.log(
        "To enable clustering, set CLUSTER=true or NODE_ENV=production"
      );
    });
  }
}

// Export for use in other files
module.exports = createApp;
