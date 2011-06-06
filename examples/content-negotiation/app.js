
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

var users = [
    { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
];

function provides(type) {
  return function(req, res, next){
    if (req.accepts(type)) return next();
    next('route');
  }
}

// curl http://localhost:3000/users -H "Accept: application/json"

app.get('/users', provides('json'), function(req, res){
  res.send(users);
});

// curl http://localhost:3000/users -H "Accept: text/html"

app.get('/users', provides('html'), function(req, res){
  res.send('<ul>' + users.map(function(user){
    return '<li>' + user.name + '</li>';
  }).join('\n') + '</ul>');
});

// curl http://localhost:3000/users -H "Accept: text/plain"

app.get('/users', function(req, res, next){
  res.contentType('txt');
  res.send(users.map(function(user){
    return user.name;
  }).join(', '));
});

app.listen(3000);
console.log('Express server listening on port 3000');