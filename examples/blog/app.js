
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../lib/express');

app = express.createServer();

// Config

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Middleware

app.configure(function(){
  app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes

require('./routes/site');
require('./routes/post');

app.listen(3000);
console.log('Express started on port 3000');