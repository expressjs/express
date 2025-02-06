'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis online-new
// $ redis-server

const express = require('../..');
let online = require('online-new');
const redis = require('redis');

const db = redis.createClient();
db.on('connect', () => {
    console.log('Connected to Redis');
});
db.on('error', (err) => {
    console.error('Redis Client Error', err);
});
db.connect();

online = online(db);

const app = express();

// activity tracking, in this case using
// the UA string, you would use req.user.id etc

app.use(async function(req, res, next){
  // fire-and-forget
  await online.add(req.headers['user-agent']);
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

app.get('/', async function(req, res, next){
  const ids = await online.last(5);
  res.send('<p>Users online: ' + ids.length + '</p>' + list(ids));
});

if (require.main === module) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
