
var tas = require('tas');
var app = require('../express')();

tas({
	settings: {
		view: function(){
			var path = require('path');

			// set our default template engine to "ejs"
			// which prevents the need for extensions
			app.set('view engine', 'ejs');

			// set views for error and 404 pages
			app.set('views', path.join(__dirname, 'views'));
		},

		logger: function(){
			var logger = require('morgan');
			if (!module.parent && 'test' !== process.env.NODE_ENV)
				app.use(logger('dev'));
		},

		public: function(){

			// serve static files
			var express = require('../express');
			var path = require('path');
			app.use(express.static(path.join(__dirname, 'public')));
		},

		session: function(){
			var session = require('express-session');
			app.use(session({ // session support
				resave: false, // don't save session if unmodified
				saveUninitialized: false, // don't create session until something stored
				secret: 'some secret here'
			}));
		},

		bodyParser: function(){

			// parse request bodies (req.body)
			var bodyParser = require('body-parser');
			app.use(bodyParser.urlencoded({ extended: true }));
		}
	},

	messages: {
		response: function(){

			// define a custom res.message() method
			// which stores messages in the session
			app.response.message = function(msg){

				// reference `req.session` via the `this.req` reference
				var sess = this.req.session;

				// simply add the msg to an array for later
				sess.messages = sess.messages || [];
				sess.messages.push(msg);
				return this;
			};
		},

		locals: function(){

			// expose the "messages" local variable when views are rendered
			app.use(function(req, res, next){
				var msgs = req.session.messages || [];

				// expose "messages" local variable
				res.locals.messages = msgs;

				// expose "hasMessages"
				res.locals.hasMessages = !! msgs.length;

				/* This is equivalent:
				 res.locals({
				 messages: msgs,
				 hasMessages: !! msgs.length
				 });
				 */

				next();

				// empty or "flush" the messages so they
				// don't build up
				req.session.messages = [];
			});
		}
	},

	controllers: {
		overrideMethod: function(){

			// allow overriding methods in query (?_method=put)
			var methodOverride = require('method-override');
			app.use(methodOverride('_method'));
		},

		load: function(){
			// load controllers
			var boot = require('./lib/boot');
			boot.do(app, { verbose: !module.parent });
		}
	},

	onError: {
		500: function(){
			app.use(function(err, req, res, next){
				if (!module.parent) console.error(err.stack); // log it
				res.status(500).render('5xx'); // error page
			});
		},

		404: function(){
			// assume 404 since no middleware responded
			app.use(function(req, res, next){
				res.status(404).render('404', { url: req.originalUrl });
			});
		}
	},

	run: function(){
		if (!module.parent) {
			app.listen(3000);
			console.log('Express started on port 3000');
		}
	}
});

module.exports = app;
