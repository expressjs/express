
var tas = require('tas');
var User = require('./models/User');
var app;

var filter = {
	ferrets: function (user) {
		return user.species === 'ferret';
	},

	cat: function (user) {
		return user.species === 'cat';
	}
};

var tasks = {
	root: function(){

		// filter ferrets only

		// naive nesting approach,
		// delegating errors to next(err)
		// in order to expose the "count"
		// and "users" locals

		app.get('/', function(req, res, next){

			User.count(function(err, count){
				if (err) return next(err);

				User.all(function(err, users){
					if (err) return next(err);

					res.render('index', {
						title: 'Users',
						count: count,
						users: users.filter(filter.ferrets)
					});
				})
			})
		});
	},

	middleware: function(){

		// this approach is cleaner,
		// less nesting and we have
		// the variables available
		// on the request object

		var user = {
			count: function (req, res, next) {
				User.count(function(err, count){
					if (err) return next(err);
					req.count = count;
					next();
				})
			},

			users: function (req, res, next) {
				User.all(function(err, users){
					if (err) return next(err);
					req.users = users;
					next();
				})
			}
		};

		app.get('/middleware', user.count, user.users, function(req, res, next){
			res.render('index', {
				title: 'Users',
				count: req.count,
				users: req.users.filter(filter.ferrets)
			});
		});
	},

	middlewareLocals: function(){

		// this approach is much like the last
		// however we're explicitly exposing
		// the locals within each middleware
		//
		// note that this may not always work
		// well, for example here we filter
		// the users in the middleware, which
		// may not be ideal for our application.
		// so in that sense the previous example
		// is more flexible with `req.users`.

		var user = {
			count: function count2(req, res, next) {
				User.count(function(err, count){
					if (err) return next(err);
					res.locals.count = count;
					next();
				})
			},

			users: function users2(req, res, next) {
				User.all(function(err, users){
					if (err) return next(err);
					res.locals.users = users.filter(filter.cat);
					next();
				})
			}
		};

		app.get('/middleware-locals', user.count, user.users, function(req, res, next){

			// you can see now how we have much less
			// to pass to res.render(). If we have
			// several routes related to users this
			// can be a great productivity booster
			res.render('index', { title: 'Users' });
		});
	},

	subsequent: function(){

		// keep in mind that middleware may be placed anywhere
		// and in various combinations, so if you have locals
		// that you wish to make available to all subsequent
		// middleware/routes you can do something like this:

		/*

		 app.use(function(req, res, next){
		 res.locals.user = req.user;
		 res.locals.sess = req.session;
		 next();
		 });

		 */

		// or suppose you have some /admin
		// "global" local variables:

		/*

		 app.use('/api', function(req, res, next){
		 res.locals.user = req.user;
		 res.locals.sess = req.session;
		 next();
		 });

		 */

		// the following is effectively the same,
		// but uses a route instead:

		/*

		 app.all('/api/*', function(req, res, next){
		 res.locals.user = req.user;
		 res.locals.sess = req.session;
		 next();
		 });

		 */
	}
};

var routes = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routes);
