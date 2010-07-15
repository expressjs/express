
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer(),
    sys = require('sys');

app.set('views', __dirname + '/views');

// Provide our app with the notion of NotFound exceptions

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);

app.get('/', function(req, res){
    res.render('index.jade');
});

app.get('/404', function(req, res){
    throw new NotFound;
});

app.get('/500', function(req, res){
    throw new Error('keyboard cat!');
});

// We can call app.error() several times as shown below.
// Here we check for an instanceof NotFound and show the
// 404 page, or we pass on to the next error handler.

app.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade');
    } else {
        next(err);
    }
});

// Here we assume all errors as 500 for the simplicity of
// this demo, however you can choose whatever you like

app.error(function(err, req, res){
    res.render('500.jade', {
       locals: {
           error: err
       } 
    });
});

app.listen(3000);