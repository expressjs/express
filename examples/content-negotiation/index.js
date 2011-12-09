
/**
 * Module dependencies.
 */

var express = require('../../');

// expose the app for require()ing
var app = module.exports = express();

var users = [
    { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
];

function provides(type) {
  return function(req, res, next){
    if (req.accepts(type)) return next();
    // invoking next() with "route" will
    // skip passed all remaining middleware
    // for this route (if any).
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
  res.type('txt');
  res.send(users.map(function(user){
    return user.name;
  }).join(', '));
});

// not being require()d
if (!module.parent) {
  app.listen(3000);
  console.log('Express server listening on port 3000');
}
