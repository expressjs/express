
var tas = require('tas');
var app;

var tasks = {
	root: function(){
		app.get('/', function(req, res) {
			res.send('Hello form root route.');
		});
	},

	api: function(){
		app.use('/api/v1', require('./api_v1'));
		app.use('/api/v2', require('./api_v2'));
	}
};

var routes = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routes);
