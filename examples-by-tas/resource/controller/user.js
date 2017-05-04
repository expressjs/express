
var tas = require('tas');
var db = require('../db');

// Fake controller.
var User = {
	index: function(req, res){
		res.send(db.users);
	},

	show: function(req, res){
		res.send(db.users[req.params.id] || { error: 'Cannot find user' });
	},

	destroy: function(req, res, id){
		var destroyed = id in db.users;
		delete db.users[id];

		res.send(destroyed ? 'destroyed' : 'Cannot find user');
	},

	range: function(req, res, a, b, format){
		var range = db.users.slice(a, b + 1);

		switch (format) {
			case 'json':
				res.send(range);
				break;

			case 'html':
			default:
				var html = '<ul>' + range.map(function(user){
							return '<li>' + user.name + '</li>';
						}).join('\n') + '</ul>';
				res.send(html);
				break;
		}
	}
};

module.exports = (User);
