
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    connect = require('connect'),
    form = require('connect-form'),
    sys = require('sys');

var app = express.createServer(
    // connect-form (http://github.com/visionmedia/connect-form)
    // middleware uses the formidable middleware to parse urlencoded
    // and multipart form data
    form(),
    
    // Used for res.redirect()
    connect.redirect()
);

app.get('/', function(req, res){
    res.send('<form method="post" enctype="form-data/multipart">'
        + '<p>Name: <input type="text" name="name" /></p>'
        + '<p>Image: <input type="file" name="image" /></p>'
        + '<p><input type="submit" value="Upload" /></p>'
        + '</form>');
});

app.post('/', function(req, res){
    // connect-form adds the req.form object
    // we can (optionally) define onComplete, passing
    // the exception (if any) fields parsed, and files parsed
    req.form.onComplete = function(err, fields, files){
        sys.puts(fields.name + ' uploaded ' + files.image.filename);
    };
});

app.listen(3000);