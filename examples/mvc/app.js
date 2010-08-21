
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

// Allow ejs templates to utilize ".html" extensions
app.register('.html', require('ejs'));

require('./mvc').boot(app);

app.listen();
console.log('Application server started on port 3000');