
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	logger: function(){
		var logger = require('morgan');
		// custom log format
		if ('test' != process.env.NODE_ENV) app.use(logger(':method :url'));
	},

	cookieParser: function(){
		var cookieParser = require('cookie-parser');

		// parses request cookies, populating
		// req.cookies and req.signedCookies
		// when the secret is passed, used
		// for signing the cookies.
		app.use(cookieParser('my secret here'));
	},

	bodyParser: function(){
		var bodyParser = require('body-parser');

		// parses x-www-form-urlencoded
		app.use(bodyParser.urlencoded({ extended: false }));
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
