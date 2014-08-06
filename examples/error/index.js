/**
 * Module dependencies.
 */

var express = require('../../');
var logger = require('morgan');
var app = module.exports = express();
var test = app.get('env') == 'test';

if (!test) app.use(logger('dev'));

// error handling middleware have an arity of 4
// instead of the typical (req, res, next),
// otherwise they behave exactly like regular
// middleware, you may have several of them,
// in different orders etc.

function error(err, req, res, next) {
  // log it
  if (!test) console.error(err.stack);

  // respond with 500 "Internal Server Error".
  res.status(500);
  res.send('Internal Server Error');
}

app.get('/', function(req, res){
  // Caught and passed down to the errorHandler middleware
  throw new Error('something broke!');
});

app.get('/next', function(req, res, next){
  // We can also pass exceptions to next()
  process.nextTick(function(){
    next(new Error('oh no!'));
  });
});

// the error handler is placed after routes
// if it were above it would not receive errors
// from app.get() etc
app.use(error);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
