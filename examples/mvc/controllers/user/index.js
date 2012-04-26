
var db = require('../../db');

exports.list = function(req, res, next){
  res.render('list', { users: db.users });
};

exports.edit = function(req, res, next){
  var user = db.users[req.params.user_id];
  if (!user) return next(new Error('User not found'));
  res.render('edit', { user: user });
};

exports.show = function(req, res, next){
  var user = db.users[req.params.user_id];
  if (!user) return next(new Error('User not found'));
  res.render('show', { user: user });
};

exports.update = function(req, res, next){
  var id = req.params.user_id;
  var user = db.users[id];
  var body = req.body;
  if (!user) return next(new Error('User not found'));
  user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + id);
};
