// hello
'use strict'

var users = require('./db');

exports.html = function(req, res){
  res.send('<ul>' + users.map(function(user){
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
};

exports.text = function(req, res){
  res.send(users.map(function(user){
    return ' - ' + user.name + '\n';
  }).join(''));
};

exports.json = function(req, res){
  res.json(users);
};

// If the handlers are needed, import them in the main router, e.g.:
// const userHandlers = require('./examples/content-negotiation/users');
// app.get('/users.html', userHandlers.html);
// app.get('/users.txt', userHandlers.text);
// app.get('/users.json', userHandlers.json);
// Otherwise, remove the file.