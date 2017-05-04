
var opts;
var callback;

var handler = {
	readFile: function(path, options, fn){
		opts = options;
		callback = fn;

		var fs = require('fs');
		fs.readFile(path, 'utf8', handler.escapeHtml);
	},

	escapeHtml: function(err, str){
		if (err) return callback(err);

		var escapeHtml = require('escape-html');
		var marked = require('marked');
		var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name){
			return escapeHtml(opts[name] || '');
		});

		callback(null, html);
	}
};

var markdown = {
	init: function(app) {

		// register .md as an engine in express view system
		app.engine('md', handler.readFile);

		// make it the default so we dont need .md
		app.set('view engine', 'md');

	}
};

module.exports = (markdown);
