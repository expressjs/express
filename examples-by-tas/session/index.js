
// first (if you have not done it yes):
// $ npm install redis
// $ brew install redis
// $ redis-server

var tas = require('tas');
var app = require('../express')();

tas({
	session: function(){
		var session = require('./session');
		session.init(app);
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
