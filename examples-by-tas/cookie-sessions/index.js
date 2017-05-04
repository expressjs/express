
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	cookieSession: function(){
		var cookieSession = require('cookie-session');

		// add req.session cookie support
		app.use(cookieSession({ secret: 'manny is cool' }));
	},

	customizeSession: function(){

		// custom middleware
		var count = require('./count');

		// do something with the session
		app.use(count.do);
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
