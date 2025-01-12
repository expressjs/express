'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

/**
 * Module dependencies.
 */

var express = require('../..');
var path = require('node:path');
var redis = require('redis');

var db = redis.createClient();

// npm install redis

// connect to Redis

db.connect()
  .catch((err) => console.error('Redis connection error:', err));

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// populate search

(async () => {
  try {
    await db.sAdd('ferret', 'tobi');
    await db.sAdd('ferret', 'loki');
    await db.sAdd('ferret', 'jane');
    await db.sAdd('cat', 'manny');
    await db.sAdd('cat', 'luna');
  } catch (err) {
    console.error('Error populating Redis:', err);
  }
})();

/**
 * GET search for :query.
 */

app.get('/search/:query{0,1}', function (req, res, next) {
  var query = req.params.query || '';
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

app.get('/client.js', function(req, res){
  res.sendFile(path.join(__dirname, 'client.js'));
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
