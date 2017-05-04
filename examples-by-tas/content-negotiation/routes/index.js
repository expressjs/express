
var tas = require('tas');
var app;

var tasks = {
	root: function(){

		// so either you can deal with different types of formatting
		// for expected response in index.js
		var formatter = require('./formatter');
		app.get('/', function(req, res){
			res.format(formatter.init(res));
		});
	},

	users: function(){

		// or you could write a tiny middleware like
		// this to add a layer of abstraction
		// and make things a bit more declarative:
		var middleware = require('./middleware');
		app.get('/users', middleware.init('./users'));
	}
};

var routes = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routes);
