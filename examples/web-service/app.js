
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

// configuration

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
  if (!key) return next(new Error('api key required'));

  // key is invalid
  if (!~apiKeys.indexOf(key)) return next(new Error('invalid api key'));

  // all good, store req.key for route access
  req.key = key;
  next();
});

// position our routes above the error handling middleware,
// and below our API middleware, since we want the API validation
// to take place BEFORE our routes
app.use(app.router);

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here,
  // or when you next(err) set res.statusCode= etc.
  res.send({ error: err.message }, 500);
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.send({ error: "Lame, can't find that" }, 404);
});

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

// we now can assume the api key is valid,
// and simply expose the data

app.get('/api/v1/users', function(req, res, next){
  res.send(users);
});

app.get('/api/v1/repos', function(req, res, next){
  res.send(repos);
});

app.get('/api/v1/user/:name/repos', function(req, res, next){
  var name = req.params.name
    , user = userRepos[name];
  
  if (user) res.send(user);
  else next();
});

app.listen(3000);
console.log('Express server listening on port 3000');