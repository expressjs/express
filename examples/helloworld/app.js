
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(3000);
