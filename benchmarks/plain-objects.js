/*!
 * Express - Plain Objects Benchmark
 * Test performance improvement from Object.create(null) -> {}
 */

"use strict";

const express = require("..");

// Create app with plain objects optimization
const app = express();

// Add some middleware to simulate real usage
app.use((req, res, next) => {
  res.locals.startTime = Date.now();
  next();
});

// Simple JSON endpoint
app.get("/json", (req, res) => {
  res.json({
    message: "Hello World",
    timestamp: Date.now(),
    optimization: "plain-objects",
  });
});

// Hello World endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Settings heavy endpoint (tests app.set/get performance)
app.get("/settings", (req, res) => {
  // Multiple setting accesses
  const env = app.get("env");
  const views = app.get("views");
  const viewEngine = app.get("view engine");

  res.json({
    env,
    views,
    viewEngine,
    performance: "optimized",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  Express Performance Benchmark Server  ║");
  console.log("╚════════════════════════════════════════╝");
  console.log("");
  console.log(`Server running on http://localhost:${port}`);
  console.log("");
  console.log("✅ Optimization #3 Applied: Plain Objects");
  console.log("   - Object.create(null) → {}");
  console.log("   - Expected: 5-8% improvement");
  console.log("");
  console.log("Benchmark Commands:");
  console.log("─────────────────────────────────────────");
  console.log(`  wrk -c 100 -d 30s -t 4 http://localhost:${port}/`);
  console.log(`  wrk -c 100 -d 30s -t 4 http://localhost:${port}/json`);
  console.log(`  autocannon -c 100 -d 30 http://localhost:${port}/`);
  console.log("");
});
