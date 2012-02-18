
/**
 * Module dependencies.
 */

var express = require('../../')
  , app = module.exports = express();

// config

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware

app.configure('development',function(){
  app.use(express.logger('dev'));
})

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Locals

app.locals.use(function(req, res){
  // expose "error" and "message" to all
  // views that are rendered.
  res.locals.error = req.session.error || '';
  res.locals.message = req.session.message || '';
  // remove them so they're not displayed on subsequent renders
  delete req.session.error;
  delete req.session.message;
});

// Routes

require('./routes/site')(app);
require('./routes/post')(app);

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}