
var tas = require('tas');
var app = require('../express')();

tas({
	logger: function(){
		var logger = require('morgan');
		var test = app.get('env') == 'test';
		if (!test) app.use(logger('dev'));
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

module.exports = app;
