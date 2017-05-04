
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	markdown: function(){
		var md = require('marked').parse;

		// register .md as an engine in express view system
		app.engine('md', function(str, options, fn){
			try {
				var html = md(str);
				html = html.replace(/\{([^}]+)\}/g, function(_, name){
					return options[name] || '';
				});
				fn(null, html);
			}
			catch(err) {
				fn(err);
			}
		});
	},

	githubView: function(){
		var GithubView = require('./github-view');

		// pointing to a particular github repo to load files from it
		app.set('views', 'expressjs/express');

		// register a new view constructor
		app.set('view', GithubView);
	},

	routes: function(){
		app.get('/', function(req, res){

			// rendering a view relative to the repo.
			// app.locals, res.locals, and locals passed
			// work like they normally would
			res.render('examples/markdown/views/index.md', { title: 'Example' });
		});

		app.get('/Readme.md', function(req, res){

			// rendering a view from https://github.com/expressjs/express/blob/master/Readme.md
			res.render('Readme.md');
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
