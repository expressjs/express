
var tas = require('tas');
var app;

var tasks = {
	site: function(){
		var site = require('./site');
		app.get('/', site.index);
	},

	user: function(){
		var user = require('./user');
		app.get('/users', user.list);
		app.all('/user/:id/:op?', user.load);
		app.get('/user/:id', user.view);
		app.get('/user/:id/view', user.view);
		app.get('/user/:id/edit', user.edit);
		app.put('/user/:id/edit', user.update);
	},

	posts: function(){
		var post = require('./post');
		app.get('/posts', post.list);
	}
};

var routes = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routes);
