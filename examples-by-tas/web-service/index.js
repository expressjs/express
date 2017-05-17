
var tas = require('tas');
var app = require('../express')();

tas({
	api: function(){
		var api = require('./api');
		api.init(app);
	},

	onError: function(){

		// middleware with an arity of 4 are considered
		// error handling middleware. When you next(err)
		// it will be passed through the defined middleware
		// in order, but ONLY those with an arity of 4, ignoring
		// regular middleware.
		app.use(function(err, req, res, next){

			// whatever you want here, feel free to populate
			// properties on `err` to treat it differently in here.
			res.status(err.status || 500);
			res.send({ error: err.message });
		});

		// our custom JSON 404 middleware. Since it's placed last
		// it will be the last middleware called, if all others
		// invoke next() and do not respond.
		app.use(function(req, res){
			res.status(404);
			res.send({ error: "Lame, can't find that" });
		});
	},

	run: function(){
		/* istanbul ignore next */
		if (!module.parent) {
			app.listen(3000);
			console.log('Express started on port 3000');
            console.log();

			console.log('try:');
            console.log('  GET /api/users?api-key=foo');
            console.log('  GET /api/repos?api-key=bar');
            console.log('  GET /api/user/tobi/repos?api-key=baz');
		}
	}
});

module.exports = app;
