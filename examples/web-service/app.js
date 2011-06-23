
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

/**
 * Generate our unique identifier.
 */

function uid() {
  return [
      Math.random() * 0xffff | 0
    , Math.random() * 0xffff | 0
    , Math.random() * 0xffff | 0
    , Date.now()
  ].join('-');
}

// map of valid api keys, typically mapped to
// account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.

var apiKeys = [uid(), uid(), uid()];

console.log('valid keys:\n ', apiKeys.join('\n  '));

// these two objects will serve as our faux database

var repos = [
    { name: 'express', url: 'http://github.com/visionmedia/express' }
  , { name: 'stylus', url: 'http://github.com/learnboost/stylus' }
  , { name: 'cluster', url: 'http://github.com/learnboost/cluster' }
];

var users = [
    { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
];

var userRepos = {
    tobi: [repos[0], repos[1]]
  , loki: [repos[1]]
  , jane: [repos[2]]
};

// if we wanted to supply more than JSON, we could
// use something similar to the content-negotiation
// example.

// here we validate the API key,
// by mounting this middleware to /api/v1
// meaning only paths prefixed with "/api/v1"
// will cause this middleware to be invoked

app.use('/api/v1', function(req, res, next){
  var key = req.query['api-key'];

  // key isnt present
  if (!key) return res.send('api key required', 401);

  // key is invalid
  if (!~apiKeys.indexOf(key)) return res.send('invalid api key', 401);

  // all good, store req.key for route access
  req.key = key;
  next();
});

// we now can assume the api key is valid,
// and simply expose the data

app.get('/api/v1/users', function(req, res, next){
  res.send(users);
});

app.get('/api/v1/repos', function(req, res, next){
  res.send(repos);
});

app.get('/api/v1/user/:name/repos', function(req, res, next){
  var name = req.params.name;
  res.send(userRepos[name]);
});

app.listen(3000);
console.log('Express server listening on port 3000');