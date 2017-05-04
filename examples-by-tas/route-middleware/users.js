
var tas = require('tas');
var db = require('./db');
var app;

var tasks = {
	routes: function(){

		// Example requests:
		//     curl http://localhost:3000/user/0
		//     curl http://localhost:3000/user/0/edit
		//     curl http://localhost:3000/user/1
		//     curl http://localhost:3000/user/1/edit (unauthorized since this is not you)
		//     curl -X DELETE http://localhost:3000/user/0 (unauthorized since you are not an admin)

		// Middleware for faux authentication
		// you would of course implement something real,
		// but this illustrates how an authenticated user
		// may interact with middleware

		app.use(function(req, res, next){
			req.authenticatedUser = db.users[0];
			next();
		});

		app.get('/', function(req, res){
			res.redirect('/user/0');
		});

		app.get('/user/:id', util.loadUser, function(req, res){
			res.send('Viewing user ' + req.user.name);
		});

		app.get('/user/:id/edit', util.loadUser, util.restrictToSelf, function(req, res){
			res.send('Editing user ' + req.user.name);
		});

		app.delete('/user/:id', util.loadUser, util.restrictTo('admin'), function(req, res){
			res.send('Deleted user ' + req.user.name);
		});
	}
};

var util = {
	loadUser: function (req, res, next) {

		// You would fetch your user from the db
		var user = db.users[req.params.id];
		if (user) {
			req.user = user;
			next();
		}
		else {
			next(new Error('Failed to load user ' + req.params.id));
		}
	},

	restrictToSelf: function (req, res, next) {

		// If our authenticated user is the user we are viewing
		// then everything is fine :)
		if (req.authenticatedUser.id == req.user.id) {
			next();
		}
		else {

			// You may want to implement specific exceptions
			// such as UnauthorizedError or similar so that you
			// can handle these can be special-cased in an error handler
			// (view ./examples/pages for this)
			next(new Error('Unauthorized'));
		}
	},

	restrictTo: function (role) {
		return function(req, res, next) {
			if (req.authenticatedUser.role == role) {
				next();
			} else {
				next(new Error('Unauthorized'));
			}
		}
	}
};

var users = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (users);
