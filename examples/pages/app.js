
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer(),
    sys = require('sys');

// "app.router" positions our routes 
// specifically above the middleware
// assigned below

app.use(app.router);

// When no more middleware require execution, aka
// our router is finished and did not respond, we
// can assume that it is "not found". Instead of
// letting Connect deal with this, we define our
// custom middleware here to simply pass a NotFound
// exception

app.use(function(req, res, next){
    next(new NotFound(req.url));
});

app.set('views', __dirname + '/views');

// Provide our app with the notion of NotFound exceptions

function NotFound(path){
    this.name = 'NotFound';
    if (path) {
        Error.call(this, 'Cannot find ' + path);
        this.path = path;
    } else {
        Error.call(this, 'Not Found');
    }
    Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);

// We can call app.error() several times as shown below.
// Here we check for an instanceof NotFound and show the
// 404 page, or we pass on to the next error handler.

// These handlers could potentially be defined within
// configure() blocks to provide introspection when
// in the development environment.

app.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', {
            locals: {
                error: err
            }
        });
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

// Routes

app.get('/', function(req, res){
    res.render('index.jade');
});

app.get('/404', function(req, res){
    throw new NotFound;
});

app.get('/500', function(req, res, next){
    next(new Error('keyboard cat!'));
});

app.listen(3000);