
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = module.exports = express.createServer();

app.get('/', function(req, res){
    res.send('Hello World');
});