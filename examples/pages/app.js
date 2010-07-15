
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer(),
    sys = require('sys');

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('index.jade');
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);

app.get('/404', function(req, res){
    throw new NotFound('foobar');
});

app.get('/500', function(req, res){
    throw new Error('keyboard cat!');
});

app.error(function(err, req, res){
    var status = err instanceof NotFound
        ? 404
        : 500;
    res.render(status + '.jade', {
       locals: {
           error: err
       } 
    });
});

app.listen(3000);