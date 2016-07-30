/**
 * Module dependencies.
 */

var express = require('../..');
var path = require('path');
var logger = require('morgan');
var app = express();

//Set up the paths
var publicPath = path.resolve(__dirname,'public');
var cssPath = path.resolve(__dirname,'public/css');
var jsPath = path.resolve(__dirname,'public/js');

// log requests
app.use(logger('dev'));

// express on its own has no notion
// of a "file". The express.static()
// middleware checks for a file matching
// the `req.path` within the directory
// that you pass it. In this case "GET /js/app.js"
// will look for "./public/js/app.js".

app.use(express.static(publicPath));

// if you wanted to "prefix" you may use
// the mounting feature of Connect, for example
// "GET /static/js/app.js" instead of "GET /js/app.js".
// The mount-path "/static" is simply removed before
// passing control to the express.static() middleware,
// thus it serves the file correctly by ignoring "/static"
app.use('/static', express.static(publicPath));

// if for some reason you want to serve files from
// several directories, you can use express.static()
// multiple times! Here we're passing "./public/css",
// this will allow "GET /style.css" instead of "GET /css/style.css":
app.use(express.static(cssPath));

//Here we're passing "./public/js",
// this will allow "GET /app.js" instead of "GET /js/app.js":
app.use(express.static(jsPath));

app.listen(3000);
console.log('listening on port 3000');
console.log('try:');
console.log('  GET /hello.txt');
console.log('  GET /js/app.js');
console.log('  GET /css/style.css');
