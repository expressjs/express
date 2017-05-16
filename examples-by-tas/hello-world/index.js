
var tas = require('tas');
var app = require('../express')();

tas({
	routes: function(){
		app.get('/', function(req, res){
			res.send('Hello World');
		});
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
