
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
