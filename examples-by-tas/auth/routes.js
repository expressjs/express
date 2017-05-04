
var tas = require('tas');
var db = require('./db');
var app;

var tasks = {
	root: function(){
		app.get('/', function(req, res){
			res.redirect('/login');
		});
	},

	restricted: function(){
		app.get('/restricted', db.restrict, function(req, res){
			res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
		});
	},

	logout: function(){
		app.get('/logout', function(req, res){
			// destroy the user's session to log them out
			// will be re-created next request
			req.session.destroy(function(){
				res.redirect('/');
			});
		});
	},

	login: {
		onEnter: function(){
			app.get('/login', function(req, res){
				res.render('login');
			});
		},

		onSubmit: function(){
			app.post('/login', function(req, res){

				db.authenticate(req.body.username, req.body.password, function(err, user){
					if (user) {

						// Regenerate session when signing in
						// to prevent fixation
						req.session.regenerate(function(){

							// Store the user's primary key
							// in the session store to be retrieved,
							// or in this case the entire user object
							req.session.user = user;
							req.session.success = 'Authenticated as ' + user.name
								+ ' click to <a href="/logout">logout</a>. '
								+ ' You may now access <a href="/restricted">/restricted</a>.';
							res.redirect('back');
						});
					}
					else {
						req.session.error = 'Authentication failed, please check your '
							+ ' username and password.'
							+ ' (use "tj" and "foobar")';
						res.redirect('/login');
					}
				});
			});
		}
	}
};

var routes = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routes);
