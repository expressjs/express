
var tas = require('tas');
var app = require('../express')();

tas({
	routeMap: function(){
		var routeMap = require('./route-map');
		routeMap.init(app);
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
