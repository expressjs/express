/**
 * Module dependencies.
 */

var express = require('../../');
var logger = require('morgan');
var app = module.exports = express();
var test = app.get('env') == 'test';

if (!test) app.use(logger('dev'));

app.get('/next/with/status/204', function(req, res, next){
  next({status: 204});
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
