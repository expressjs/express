
var tas = require('tas');
var db = require('./db');
var app;

var tasks = {
	query: function(){

		/**
		 * GET search for :query.
		 */

		app.get('/search/:query?', function(req, res){
			var query = req.params.query;
			db.smembers(query, function(err, vals){
				if (err) return res.send(500);
				res.send(vals);
			});
		});
	},

	client: function(){

		/**
		 * GET client javascript. Here we use sendFile()
		 * because serving __dirname with the static() middleware
		 * would also mean serving our server "index.js" and the "search.jade"
		 * template.
		 */

		var path = require('path');
		app.get('/client.js', function(req, res){
			res.sendFile(path.join(__dirname, 'client.js'));
		});
	}
};

var search = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (search);
