
/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , app = express.createServer();

// Faux database

var users = [
    { name: 'tj' }
  , { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
  , { name: 'bandit' }
];

// Convert :to and :from to integers

app.param(['to', 'from'], function(n){ return parseInt(n, 10); });

// Load user by id

app.param('user', function(req, res, next, id){
  if (req.user = users[id]) {
    next();
  } else {
    next(new Error('failed to find user'));
  }
});

/**
 * GET index.
 */

app.get('/', function(req, res){
  res.send('Visit /user/0 or /users/0-2');
});

/**
 * GET :user.
 */

app.get('/user/:user', function(req, res, next){
  res.send('user ' + req.user.name);
});

/**
 * GET users :from - :to.
 */

app.get('/users/:from-:to', function(req, res, next){
  var from = req.params.from
    , to = req.params.to
    , names = users.map(function(user){ return user.name; });
  res.send('users ' + names.slice(from, to).join(', '));
});

app.listen(3000);
console.log('Express application listening on port 3000');