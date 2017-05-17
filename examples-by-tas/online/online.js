
var tas = require('tas');
var online = require('online');
var app;

var tasks = {
	init: function(){
		var redis = require('redis');
		var db = redis.createClient();
		online = online(db);
	},

	app: function(){

		// activity tracking, in this case using
		// the UA string, you would use req.user.id etc

		app.use(function(req, res, next){
			// fire-and-forget
			online.add(req.headers['user-agent']);
			next();
		});
	},

	users: function(){

		// List helper
		var list = {
			do: function (ids) {
				return '<ul>' + ids.map(function(id){
							return '<li>' + id + '</li>';
						}).join('') + '</ul>';
			}
		};

		// GET users online.
		app.get('/', function(req, res, next){
			online.last(5, function(err, ids){
				if (err) return next(err);
				res.send('<p>Users online: ' + ids.length + '</p>' + list.do(ids));
			});
		});
	}
};

var exports = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (exports);
