
var tas = require('tas');
var app;

var tasks = {
	root: {
		input: function(){
			app.get('/', function(req, res){
				if (req.cookies.remember) {
					res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
				}
				else {
					res.send('<form method="post"><p>Check to <label>'
						+ '<input type="checkbox" name="remember"/> remember me</label> '
						+ '<input type="submit" value="Submit"/>.</p></form>');
				}
			});
		},

		submit: function(){
			app.post('/', function(req, res){
				var minute = 60000;
				if (req.body.remember) res.cookie('remember', 1, { maxAge: minute });
				res.redirect('back');
			});
		}
	},

	forget: function(){
		app.get('/forget', function(req, res){
			res.clearCookie('remember');
			res.redirect('back');
		});
	}
};

var routes = {
	init: function(_app){
		app = _app;
		tas(tasks);
	}
};

module.exports = (routes);
