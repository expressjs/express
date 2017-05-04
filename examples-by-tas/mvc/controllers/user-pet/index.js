/**
 * Module dependencies.
 */

var db = require('../../db');
var userPet = {
	name: 'pet',
	prefix: '/user/:user_id',

	create: function(req, res, next){
		var id = req.params.user_id;
		var body = req.body;

		var user = db.users[id];
		if (!user) return next('route');

		var pet = { name: body.pet.name };
		pet.id = db.pets.push(pet) - 1;
		user.pets.push(pet);

		res.message('Added pet ' + body.pet.name);
		res.redirect('/user/' + id);
	}
};

module.exports = (userPet);
