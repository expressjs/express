/**
 * Module dependencies.
 */

var db = require('../../db');
var pet = {
	engine: 'ejs',

	before: function(req, res, next){
		var pet = db.pets[req.params.pet_id];
		if (!pet) return next('route');
		req.pet = pet;
		next();
	},

	show: function(req, res, next){
		res.render('show', { pet: req.pet });
	},

	edit: function(req, res, next){
		res.render('edit', { pet: req.pet });
	},

	update: function(req, res, next){
		var body = req.body;
		req.pet.name = body.pet.name;
		res.message('Information updated!');
		res.redirect('/pet/' + req.pet.id);
	}
};

module.exports = (pet);
