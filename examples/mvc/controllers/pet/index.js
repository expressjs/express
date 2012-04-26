
var db = require('../../db');

exports.engine = 'jade';

exports.show = function(req, res, next){
  var pet = db.pets[req.params.pet_id];
  if (!pet) return next(new Error('Pet not found'));
  res.render('show', { pet: pet });
};

exports.edit = function(req, res, next){
  var pet = db.pets[req.params.pet_id];
  if (!pet) return next(new Error('Pet not found'));
  res.render('edit', { pet: pet });
};

exports.update = function(req, res, next){
  var id = req.params.pet_id;
  var pet = db.pets[id];
  var body = req.body;
  if (!pet) return next(new Error('Pet not found'));
  pet.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/pet/' + id);
};
