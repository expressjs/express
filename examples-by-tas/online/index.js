
// first (if you have not done it yet):
// $ npm install redis
// $ brew install redis
// $ redis-server

// then :
// $ npm install online

var tas = require('tas');
var app = require('../express')();

tas({
	online: function(){
		var online = require('./online');
		online.init(app);
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
