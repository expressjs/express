
/**
 * Module dependencies.
 */

var app = module.exports = require('express').createApplication();

app.get('/', function(req, res){
    res.writeHead(200, {});
    res.end('Hello World');
});