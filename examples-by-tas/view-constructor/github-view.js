/**
 * Module dependencies.
 */

var githubView = {
	name: null,
	engine: null,
	path: null,

	init: function (name, options){
		options = options || {};

		var path = require('path');
		var extName = path.extname;

		/**
		 * Custom view that fetches and renders
		 * remove github templates. You could
		 * render templates from a database etc.
		 */

		this.name = name;
		this.engine = options.engines[extName(name)];

		// "root" is the app.set('views') setting, however
		// in your own implementation you could ignore this
		this.path = '/' + options.root + '/master/' + name;
	},

	render: function(options, fn){
		var self = this;
		var opts = {
			host: 'raw.githubusercontent.com',
			port: 443,
			path: this.path,
			method: 'GET'
		};

		var https = require('https');
		https.request(opts, function(res) {
			var buf = '';
			res.setEncoding('utf8');
			res.on('data', function(str){ buf += str });
			res.on('end', function(){
				self.engine(buf, options, fn);
			});
		}).end();
	}
};

var exports = {
	entry: function(name, options){
		githubView.init(name, options);
		return githubView;
	}
};

module.exports = (exports.entry);
