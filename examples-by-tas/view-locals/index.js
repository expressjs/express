
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	view: function(){
		var path = require('path');
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'ejs');
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
