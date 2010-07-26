
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    connect = require('connect');

var app = express.createServer();

app.get('/', function(req, res){
    // Caught and passed down to the errorHandler middleware
    throw new Error('something broke!');
});

app.get('/next', function(req, res, next){
    // We can also pass exceptions to next()
    next(new Error('oh no!'))
});

// The errorHandler middleware in this case will dump exceptions to stderr
// as well as show the stack trace in responses, currently handles text/plain,
// text/html, and application/json responses to aid in development
app.use('/', connect.errorHandler({ dumpExceptions: true, showStack: true }));

app.listen(3000);