
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = module.exports = express.createServer();

// Config

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// mount hook

app.mounted(function(other){
  console.log('ive been mounted!');
});

// Middleware

app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(require('./middleware/locals'));
  app.use(messages());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes

require('./routes/site')(app);
require('./routes/post')(app);

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}