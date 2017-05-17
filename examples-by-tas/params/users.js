
var tas = require('tas');
var db = require('./db');
var app;

var tasks = {

	index: function(){

		// GET index.
		app.get('/', function(req, res){
			res.send('Visit /user/0 or /users/0-4');
		});
	},

	user: function(){

		// GET :user.
		app.get('/user/:user', function(req, res, next){
			res.send('user ' + req.user.name);
		});
	},

	users: function(){

		// GET users :from - :to.
		app.get('/users/:from-:to', function(req, res, next){
			var from = req.params.from;
			var to = req.params.to;
			var names = db.users.map(function(user){ return user.name; });
			res.send('users ' + names.slice(from, to + 1).join(', '));
		});
	},

	params: function(){

		// Create HTTP error
		var createError = {
			do: function (status, message) {
				var err = new Error(message);
				err.status = status;
				return err;
			}
		};

		// Convert :to and :from to integers
		app.param(['to', 'from'], function(req, res, next, num, name){
			req.params[name] = parseInt(num, 10);
			if( isNaN(req.params[name]) ){
				next(createError.do(400, 'failed to parseInt '+num));
			}
			else {
				next();
			}
		});

		// Load user by id
		app.param('user', function(req, res, next, id){
			if (req.user = db.users[id]) {
				next();
			}
			else {
				next(createError.do(404, 'failed to find user'));
			}
		});
	}
};

var users = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (users);
