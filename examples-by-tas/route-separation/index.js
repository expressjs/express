
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	views: function(){
		var path = require('path');
		app.set('view engine', 'jade');
		app.set('views', path.join(__dirname, 'views'));
	},

	logger: function(){
		var logger = require('morgan');
		/* istanbul ignore next */
		if (!module.parent) {
			app.use(logger('dev'));
		}
	},

	overrideMethod: function(){
		var methodOverride = require('method-override');
		app.use(methodOverride('_method'));
	},

	cookieParser: function(){
		var cookieParser = require('cookie-parser');
		app.use(cookieParser());
	},

	bodyParser: function(){
		var bodyParser = require('body-parser');
		app.use(bodyParser.urlencoded({ extended: true }));
	},

	public: function(){
		var express = require('../express');
		var path = require('path');
		app.use(express.static(path.join(__dirname, 'public')));
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
