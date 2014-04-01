/**
 * Module dependencies.
 */

var express = require('../..');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var format = require('util').format;

var app = module.exports = express();

app.use(bodyParser());
app.use(function(req, res, next){
	console.log(req.method);
	if(req.method === 'POST' && req.headers['content-type'].indexOf("multipart/form-data") !== -1){
		var form = new multiparty.Form();
		form.parse(req, function(err, fields, files){
			req.files = files;
			next();
		});
		
	}
	else next();
	
});


app.get('/', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  res.send(format('\nuploaded %s (%d Kb) to %s as %s'
    , req.files.image[0].name
    , req.files.image[0].size / 1024 | 0
    , req.files.image[0].path
    , req.body.title));
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
