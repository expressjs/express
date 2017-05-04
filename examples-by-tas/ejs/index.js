
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	engine: function(){

		// Register ejs as .html. If we did
		// not call this, we would need to
		// name our views foo.ejs instead
		// of foo.html. The __express method
		// is simply a function that engines
		// use to hook into the Express view
		// system by default, so if we want
		// to change "foo.ejs" to "foo.html"
		// we simply pass _any_ function, in this
		// case `ejs.__express`.
		app.engine('.html', require('ejs').__express);

		// Without this you would need to
		// supply the extension to res.render()
		// ex: res.render('users.html').
		app.set('view engine', 'html');
	},

	views: function(){
		// Optional since express defaults to CWD/views
		var path = require('path');
		app.set('views', path.join(__dirname, 'views'));
	},

	public: function(){
		// Path to our public directory
		var path = require('path');
		var express = require('../express');
		app.use(express.static(path.join(__dirname + 'public')));
	},

	routes: function(){
		var routes = require('./routes');
		routes.init(app);
	},

	run: function(){
		/* istanbul ignore next */
		if (!module.parent) {
			app.listen(3000);
			console.log('Express started on port 3000');
		}
	}
});

module.exports = app;
