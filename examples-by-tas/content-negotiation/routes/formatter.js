
var db = require('../db');
var res;

var formatter = {

	init: function(_res){
		res = _res;
		return this;
	},

	html: function(){
		res.send('<ul>' + db.users.map(function(user){
				return '<li>' + user.name + '</li>';
			}).join('') + '</ul>');
	},

	text: function(){
		res.send(db.users.map(function(user){
			return ' - ' + user.name + '\n';
		}).join(''));
	},

	json: function(){
		res.json(db.users);
	}
};

module.exports = (formatter);
