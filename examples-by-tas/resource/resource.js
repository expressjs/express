
var tas = require('tas');
var app;

var tasks = {
	examples: function(){
		app.get('/', function(req, res){
			res.send([
				'<h1>Examples:</h1> <ul>'
				, '<li>GET /users</li>'
				, '<li>GET /users/1</li>'
				, '<li>GET /users/3</li>'
				, '<li>GET /users/1..3</li>'
				, '<li>GET /users/1..3.json</li>'
				, '<li>DELETE /users/4</li>'
				, '</ul>'
			].join('\n'));
		});
	},

	resource: function(){

		// Ad-hoc example resource method
		app.resource = function(path, obj) {
			this.get(path, obj.index);
			this.get(path + '/:a..:b.:format?', function(req, res){
				var a = parseInt(req.params.a, 10);
				var b = parseInt(req.params.b, 10);
				var format = req.params.format;
				obj.range(req, res, a, b, format);
			});

			this.get(path + '/:id', obj.show);
			this.delete(path + '/:id', function(req, res){
				var id = parseInt(req.params.id, 10);
				obj.destroy(req, res, id);
			});
		};
	},

	users: function(){
		var User = require('./controller/user');

		// curl http://localhost:3000/users     -- responds with all users
		// curl http://localhost:3000/users/1   -- responds with user 1
		// curl http://localhost:3000/users/4   -- responds with error
		// curl http://localhost:3000/users/1..3 -- responds with several users
		// curl -X DELETE http://localhost:3000/users/1  -- deletes the user
		app.resource('/users', User);
	}
};

var resource = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (resource);
