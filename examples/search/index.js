"use strict";

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

/**
 * Module dependencies.
 */

var express = require("../..");
var path = require("node:path");
var db;
try {
  var redis = require("redis");
  db = redis.createClient();
} catch (e) {
  console.warn(
    "redis module not found — using in-memory fallback for examples/search",
  );
  const _store = Object.create(null);
  db = {
    async connect() {
      return;
    },
    async sAdd(key, val) {
      _store[key] = _store[key] || new Set();
      _store[key].add(val);
    },
    async sMembers(key) {
      return Array.from(_store[key] || []);
    },
  };
}
var app = express();

app.use(express.static(path.join(__dirname, "public")));

const fs = require("node:fs");
const InjectMetaTransform = require("../../lib/injectMetaTransform");
const isbot = require("isbot");
const escapeHtml = require("escape-html");

// npm install redis

/**
 * Redis Initialization
 */

async function initializeRedis() {
  try {
    // connect to Redis

    await db.connect();

    // populate search

    await db.sAdd("ferret", "tobi");
    await db.sAdd("ferret", "loki");
    await db.sAdd("ferret", "jane");
    await db.sAdd("cat", "manny");
    await db.sAdd("cat", "luna");
  } catch (err) {
    console.error("Error initializing Redis:", err);
    process.exit(1);
  }
}

/**
 * GET search for :query.
 */

app.get("/search/{:query}", function (req, res, next) {
  var query = req.params.query || "";
  db.sMembers(query)
    .then((vals) => res.send(vals))
    .catch((err) => {
      console.error(`Redis error for query "${query}":`, err);
      next(err);
    });
});

/**
 * GET client javascript. Here we use sendFile()
 * because serving __dirname with the static() middleware
 * would also mean serving our server "index.js" and the "search.jade"
 * template.
 */

app.get("/client.js", function (req, res) {
  res.sendFile(path.join(__dirname, "client.js"));
});

/**
 * Example bot-aware video route: injects OG meta for crawlers only
 */
app.get("/video/:id", async function (req, res, next) {
  try {
    // Replace with your DB lookup
    const id = req.params.id;
    const video = {
      title: `Video ${id}`,
      description: `Description for video ${id}`,
    };

    const indexPath = path.join(__dirname, "public", "index.html");

    const ua = req.get("user-agent") || "";
    if (!isbot(ua)) {
      return res.sendFile(indexPath);
    }

    const metaHtml =
      `<meta property="og:title" content="${escapeHtml(video.title)}">` +
      `<meta property="og:description" content="${escapeHtml(video.description)}">`;

    res.type("html");
    const stream = fs.createReadStream(indexPath);
    stream.on("error", next);
    stream.pipe(new InjectMetaTransform(metaHtml)).pipe(res);
  } catch (err) {
    next(err);
  }
});

/**
 * Start the Server
 */

(async () => {
  await initializeRedis();
  if (!module.parent) {
    app.listen(3000);
    console.log("Express started on port 3000");
  }
})();
