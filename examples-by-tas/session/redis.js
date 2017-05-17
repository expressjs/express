/**
* Module dependencies.
*/
var tas = require('tas');
var app = require('../express')();

tas({
	logger: function(){
		var logger = require('morgan');
		app.use(logger('dev'));
	},

	session: function(){
		var session = require('./redis-session');
		session.init(app);
	},

	run: function(){
		app.listen(3000);
		console.log('Express app started on port 3000');
	}
});

module.exports = app;
