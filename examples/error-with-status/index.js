/**
 * Module dependencies.
 */

var express = require('../../');
var logger = require('morgan');
var app = module.exports = express();
var test = app.get('env') == 'test';

if (!test) app.use(logger('dev'));

// errors passed to next may have a status
// code set.  It will be honored as long
// as it is an error code greater or equal
// to 400.

app.get('/pass/queryStatus/to/next', function(req, res, next){
  next({status: req.query.status});
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
