
var tas = require('tas');
var app;

var tasks = {
	list: function(){
		app.get('/', function(req, res){
			res.send('<ul>'
				+ '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
				+ '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
				+ '<li>Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>'
				+ '</ul>');
		});
	},

	download: function(){
		var path = require('path');

		// /files/* is accessed via req.params[0]
		// but here we name it :file
		app.get('/files/:file(*)', function(req, res, next){
			var filePath = path.join(__dirname, 'files', req.params.file);

			res.download(filePath, function (err) {
				if (!err) return; // file sent
				if (err && err.status !== 404) return next(err); // non-404 error

				// file for download not found
				res.statusCode = 404;
				res.send('Cant find that file, sorry!');
			});
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
