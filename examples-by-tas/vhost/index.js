
/*
 edit /etc/hosts:

 127.0.0.1       foo.example.com
 127.0.0.1       bar.example.com
 127.0.0.1       example.com
 */

var tas = require('tas');
var express = require('../express');

var app = express();
var main = express();
var redirect = express();

tas({
	logger: function(){
		var logger = require('morgan');
		if (!module.parent) main.use(logger('dev'));
	},

	main: function(){
		main.get('/', function(req, res){
			res.send('Hello from main app!');
		});

		main.get('/:sub', function(req, res){
			res.send('requested ' + req.params.sub);
		});
	},

	redirect: function(){
		redirect.use(function(req, res){
			if (!module.parent) console.log(req.vhost);
			res.redirect('http://example.com:3000/' + req.vhost[0]);
		});
	},

	vhost: function(){
		var vhost = require('vhost');
		app.use(vhost('*.example.com', redirect)); // Serves all subdomains via Redirect app
		app.use(vhost('example.com', main)); // Serves top level domain via Main server app
	},

	run: function(){
		/* istanbul ignore next */
		if (!module.parent) {
			app.listen(3000);
			console.log('Express started on port 3000');
            console.log();

            console.log('try:');
            console.log('  GET http://example.com:3000');
            console.log('  GET http://foo.example.com:3000');
            console.log('  GET http://bar.example.com:3000');
            console.log('  GET http://blog.example.com:3000');
		}
	}
});

module.exports = app;
