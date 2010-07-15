
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer();

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('index.jade');
});

app.get('/404', function(req, res, params, next){
    var err = new Error('cant find that sorry');
    err.errno = process.ENOENT;
    next(err);
});

app.get('/500', function(req, res){
    throw new Error('keyboard cat!');
});

app.error(function(err, req, res, next){
    var status = err.errno === process.ENOENT
        ? 404
        : 500;
    res.render(status + '.jade', {
       locals: {
           error: err
       } 
    });
});

app.listen(3000);