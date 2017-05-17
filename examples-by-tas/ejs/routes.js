
var tas = require('tas');
var db = require('./db');
var app;

var tasks = {
	root: function(){
		app.get('/', function(req, res){
			res.render('users', {
				users: db.users,
				title: "EJS example",
				header: "Some users"
			});
		});
	}
};

var routes = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routes);
