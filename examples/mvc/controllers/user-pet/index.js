'use strict'

/**
 * Module dependencies.
 */

const db = require('../../db')

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next){
  const id = req.params.user_id
  const user = db.users[id]
  const body = req.body
  if (!user) return next('route');
  const pet = { name: body.pet.name }
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  res.message('Added pet ' + body.pet.name);
  res.redirect('/user/' + id);
};
