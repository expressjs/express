
var hash = require('pbkdf2-password')();

// dummy database
var users = {
	tj: { name: 'tj' }
};

var db = {

	init: function(){

		// when you create a user, generate a salt
		// and hash the password ('foobar' is the pass here)
		hash({ password: 'foobar' }, function (err, pass, salt, hash) {
			if (err) throw err;

			// store the salt & hash in the "db"
			users.tj.salt = salt;
			users.tj.hash = hash;
		});

		return this;
	},

	// Authenticate using our plain-object database of doom!
	authenticate: function (name, pass, fn) {
		if (!module.parent) console.log('authenticating %s:%s', name, pass);

		var user = users[name];

		// query the db for the given username
		if (!user) return fn(new Error('cannot find user'));

		// apply the same algorithm to the POSTed password, applying
		// the hash against the pass / salt, if there is a match we
		// found the user
		hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
			if (err) return fn(err);
			if (hash == user.hash) return fn(null, user);
			fn(new Error('invalid password'));
		});
	},

	restrict: function (req, res, next) {
		if (req.session.user) {
			next();
		}
		else {
			req.session.error = 'Access denied!';
			res.redirect('/login');
		}
	}

}.init();

module.exports = (db);
