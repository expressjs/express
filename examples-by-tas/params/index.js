
var tas = require('tas');
var app = require('../express')();

tas({
	users: function(){
		var users = require('./users');
		users.init(app);
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
