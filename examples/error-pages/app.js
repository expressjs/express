
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Serve default connect favicon
app.use(express.favicon());

// Logger is placed below favicon, so favicon.ico
// requests will not be logged
app.use(express.logger('":method :url" :status'));

// "app.router" positions our routes 
// specifically above the middleware
// assigned below

app.use(app.router);

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  res.render('404', { status: 404, url: req.url });
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.


app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.render('500', {
      status: err.status || 500
    , error: err
  });
});

// Routes

app.get('/', function(req, res){
  res.render('index.jade');
});

app.get('/404', function(req, res, next){
  next();
});

app.get('/403', function(req, res, next){
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

app.get('/500', function(req, res, next){
  next(new Error('keyboard cat!'));
});

app.listen(3000);
console.log('Express app started on port 3000');