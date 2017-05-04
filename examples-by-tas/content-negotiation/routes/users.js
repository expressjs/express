
var db = require('../db');

var users = {
	html: function(req, res){
		res.send('<ul>' + db.users.map(function(user){
				return '<li>' + user.name + '</li>';
			}).join('') + '</ul>');
	},

	text: function(req, res){
		res.send(db.users.map(function(user){
			return ' - ' + user.name + '\n';
		}).join(''));
	},

	json: function(req, res){
		res.json(db.users);
	}
};

module.exports = (users);
