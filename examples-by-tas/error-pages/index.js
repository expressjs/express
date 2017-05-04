
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	views: function(){
		var path = require('path');
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'ejs');
	},

	verboseErrors: function(){
		// our custom "verbose errors" setting
		// which we can use in the templates
		// via settings['verbose errors']
		app.enable('verbose errors');

		// disable them in production
		// use $ NODE_ENV=production node examples/error-pages
		if ('production' == app.settings.env) app.disable('verbose errors');
	},

	logger: function(){
		var logger = require('morgan');
		var silent = 'test' == process.env.NODE_ENV;
		silent || app.use(logger('dev'));
	},

	onError: function(){
		var onError = require('./onError');
		onError.init(app);
	},

	run: function(){
		/* istanbul ignore next */
		if (!module.parent) {
			app.listen(3000);
			console.log('Express started on port 3000');
		}
	}
});

module.exports = (app);
