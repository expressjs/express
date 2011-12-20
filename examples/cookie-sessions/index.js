
/**
 * Module dependencies.
 */

var express = require('../../');

var app = module.exports = express();

/**
 * Cookie session middleware using the given cookie `name`.
 * 
 * Here we simply check for a signed cookie of the same name,
 * then save the object as JSON on response, again as a signed cookie.
 */

function cookieSessions(name) {
  return function(req, res, next) {
    req.session = req.signedCookies[name] || {};

    res.on('header', function(){
      res.signedCookie(name, req.session);
    });

    next();
  }
}

// for this we need cookie support! this will
// populate req.{signedCookies,cookies}()

app.use(express.cookieParser('manny is cool'));
app.use(cookieSessions('sid'));
app.use(count);

// do something with our session

function count(req, res) {
  req.session.count = req.session.count || 0;
  var n = req.session.count++;
  res.send('viewed ' + n + ' times\n');
}

if (!module.parent) {
  app.listen(3000);
  console.log('Express server listening on port 3000');
}