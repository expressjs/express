
var tas = require('tas');
var app;

var tasks = {
	setup: function(){
		var session = require('express-session');

		// Populates req.session
		app.use(session({
			resave: false, // don't save session if unmodified
			saveUninitialized: false, // don't create session until something stored
			secret: 'keyboard cat'
		}));
	},

	index: function(){
		app.get('/', function(req, res){
			var body = '';
			if (req.session.views) {
				++ req.session.views;
			}
			else {
				req.session.views = 1;
				body += '<p>First time visiting? view this page in several browsers :)</p>';
			}
			res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
		});
	}
};

var session = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (session);
