
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

// Our app IS the exports, this prevents require('./app').app,
// instead it is require('./app');
var app = module.exports = express.createServer();

// Illustrates that an app can be broken into
// several files, but yet extend the same app
require('./main');
require('./contact');

// Illustrates that one app (Server instance) can
// be "mounted" to another at the given route.
app.use('/blog', require('./blog'));

app.listen(3000);