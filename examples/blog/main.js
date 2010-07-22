
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

// Define our main application

var app = module.exports = express.createServer();

app.get('/', function(req, res){
    res.send('<p>Visit /blog</p>');
});
