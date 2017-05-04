
var tas = require('tas');
var db = require('./db');
var app;

var tasks = {
	users: function(){

		// map of valid api keys, typically mapped to
		// account info with some sort of database like redis.
		// api keys do _not_ serve as authentication, merely to
		// track API usage or help prevent malicious behavior etc.

		// we now can assume the api key is valid,
		// and simply expose the data

		app.get('/api/users', function(req, res, next){
			res.send(db.users);
		});
	},

	repos: function(){
		app.get('/api/repos', function(req, res, next){
			res.send(db.repos);
		});
	},

	userRepos: function(){
		app.get('/api/user/:name/repos', function(req, res, next){
			var name = req.params.name;
			var user = db.userRepos[name];

			if (user) res.send(user);
			else next();
		});
	},

	onError: function(){

		// create an error with .status. we
		// can then use the property in our
		// custom error handler (Connect repects this prop as well)

		var error = {
			do: function (status, msg) {
				var err = new Error(msg);
				err.status = status;
				return err;
			}
		};

		// if we wanted to supply more than JSON, we could
		// use something similar to the content-negotiation
		// example.

		// here we validate the API key,
		// by mounting this middleware to /api
		// meaning only paths prefixed with "/api"
		// will cause this middleware to be invoked

		var apiKeys = ['foo', 'bar', 'baz'];

		app.use('/api', function(req, res, next){
			var key = req.query['api-key'];

			// key isn't present
			if (!key) return next(error.do(400, 'api key required'));

			// key is invalid
			if (!~apiKeys.indexOf(key)) return next(error.do(401, 'invalid api key'));

			// all good, store req.key for route access
			req.key = key;
			next();
		});
	}
};

var api = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (api);
