
// first:
// $ npm install tas --save

var tas = require('tas');
var app = require('../express')();

tas({
	views: function(){
		var path = require('path');
		app.set('view engine', 'ejs');
		app.set('views', path.join(__dirname, 'views'));
	},

	bodyParser: function(){
		var bodyParser = require('body-parser');
		app.use(bodyParser.urlencoded({ extended: false }));
	},

	session: function(){
		var session = require('express-session');
		app.use(session({
			resave: false, // don't save session if unmodified
			saveUninitialized: false, // don't create session until something stored
			secret: 'shhhh, very secret'
		}));
	},

	message: function(){
		// Session-persisted message middleware
		app.use(function(req, res, next){
			var err = req.session.error;
			var msg = req.session.success;
			delete req.session.error;
			delete req.session.success;
			res.locals.message = '';
			if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
			if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
			next();
		});
	},

	routes: function(){
		var routes = require('./routes');
		routes.init(app);
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
