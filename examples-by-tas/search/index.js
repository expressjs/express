
// first:
// $ npm install tas --save
// $ npm install redis
// $ redis-server

/**
* Module dependencies.
*/

var tas = require('tas');
var app = require('../express')();

tas({
	public: function(){
		var express = require('../express');
		var path = require('path');
		app.use(express.static(path.join(__dirname, 'public')));
	},

	search: function(){
		var search = require('./search');
		search.init(app);
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
