
var tas = require('tas');
var app;

var tasks = {
	route: function(){
		var verbose = process.env.NODE_ENV != 'test';

		app.map = function(a, route){
			route = route || '';
			for (var key in a) {
				switch (typeof a[key]) {
					// { '/path': { ... }}
					case 'object':
						app.map(a[key], route + key);
						break;
					// get: function(){ ... }
					case 'function':
						if (verbose) console.log('%s %s', key, route);
						app[key](route, a[key]);
						break;
				}
			}
		};
	},

	map: function(){

		var users = {
			list: function(req, res){
				res.send('user list');
			},

			get: function(req, res){
				res.send('user ' + req.params.uid);
			},

			delete: function(req, res){
				res.send('delete users');
			}
		};

		var pets = {
			list: function(req, res){
				res.send('user ' + req.params.uid + '\'s pets');
			},

			delete: function(req, res){
				res.send('delete ' + req.params.uid + '\'s pet ' + req.params.pid);
			}
		};

		app.map({
			'/users': {
				get: users.list,
				delete: users.delete,
				'/:uid': {
					get: users.get,
					'/pets': {
						get: pets.list,
						'/:pid': {
							delete: pets.delete
						}
					}
				}
			}
		});
	}
};

var routeMap = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routeMap);
