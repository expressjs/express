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
var online = require('./online-tracker');
var redis = require('redis');
var db = redis.createClient();

// online

online = online(db);

// app

var app = express();

// activity tracking, in this case using
// the UA string, you would use req.user.id etc

app.use(async (req, res, next) => {
  try {
    // fire-and-forget
    await online.add(req.headers['user-agent']);
  } catch (err) {
    next(err);
  }
  next();
});

/**
 * List helper.
 */

function list(ids) {
  return '<ul>' + ids.map(function(id){
    return '<li>' + id + '</li>';
  }).join('') + '</ul>';
}

/**
 * GET users online.
 */

app.get('/', async (req, res, next) => {
  try {
      const activeUsers = await online.last(5);
      res.send('<p>Users online:' + activeUsers.length + '</p>' + list(activeUsers));
    } catch (err) {
      next(err);
  }
});


/**
 * Redis Initialization
 */
async function initializeRedis() {
  try {
    // Connect to Redis
    await db.connect();
  } catch (err) {
    console.error('Error initializing Redis:', err);
    process.exit(1);
  }
}

/**
 * Start the Server
 */

(async () => {
  await initializeRedis(); // Initialize Redis before starting the server
  if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
  }
})();
