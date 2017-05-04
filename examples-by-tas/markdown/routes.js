
var tas = require('tas');
var app;

var tasks = {
	set: function(){
		app.get('/', function(req, res){
			res.render('index', { title: 'Markdown Example' });
		});

		app.get('/fail', function(req, res){
			res.render('missing', { title: 'Markdown Example' });
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
