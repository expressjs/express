/**
 * Module dependencies.
 */

var express = require('../../');
var cookie-parser = require('cookie-parser');

var app = module.exports = express();

// pass a secret to cookieParser() for signed cookies
app.use(cookieParser('manny is cool'));

// add req.session cookie support
app.use(cookieSession());

// do something with the session
app.use(count);

// custom middleware
function count(req, res) {
  req.session.count = req.session.count || 0;
  var n = req.session.count++;
  res.send('viewed ' + n + ' times\n');
}

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
