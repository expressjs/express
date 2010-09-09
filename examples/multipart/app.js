
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    form = require('./../../support/connect-form'),
    sys = require('sys');

var app = express.createServer(
    // connect-form (http://github.com/visionmedia/connect-form)
    // middleware uses the formidable middleware to parse urlencoded
    // and multipart form data
    form({ keepExtensions: true })
);

app.get('/', function(req, res){
    res.send('<form method="post" enctype="form-data/multipart">'
        + '<p>Image: <input type="file" name="image" /></p>'
        + '<p><input type="submit" value="Upload" /></p>'
        + '</form>');
});

app.post('/', function(req, res, next){

    // connect-form adds the req.form object
    // we can (optionally) define onComplete, passing
    // the exception (if any) fields parsed, and files parsed
    req.form.complete(function(err, fields, files){
        if (err) {
            next(err);
        } else {
            console.log('\nuploaded %s to %s', 
                files.image.filename,
                files.image.path);
            res.redirect('back');
        }
    });

    // We can add listeners for several form
    // events such as "progress"
    req.form.addListener('progress', function(bytesReceived, bytesExpected){
        var percent = (bytesReceived / bytesExpected * 100) | 0;
        sys.print('Uploading: %' + percent + '\r');
    });
});

app.listen(3000);