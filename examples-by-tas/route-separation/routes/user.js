
var tas = require('tas');
var db = require('../db');

var user = {
	list: function(req, res){
		res.render('users', { title: 'Users', users: db.users });
	},

	load: function(req, res, next){
		var id = req.params.id;
		req.user = db.users[id];

		if (req.user) {
			next();
		}
		else {
			var err = new Error('cannot find user ' + id);
			err.status = 404;
			next(err);
		}
	},

	view: function(req, res){
		res.render('users/view', {
			title: 'Viewing user ' + req.user.name,
			user: req.user
		});
	},

	edit: function(req, res){
		res.render('users/edit', {
			title: 'Editing user ' + req.user.name,
			user: req.user
		});
	},

	update: function(req, res){

		// Normally you would handle all kinds of
		// validation and save back to the db
		var user = req.body.user;
		req.user.name = user.name;
		req.user.email = user.email;
		res.redirect('back');
	}
};

module.exports = (user);
