'use strict';

/**
 * Module dependencies.
 */

var express = require('../../');
var app = (module.exports = express());
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var crypto = require('node:crypto');

// custom log format
if (process.env.NODE_ENV !== 'test') app.use(logger(':method :url'));

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser('my secret here'));

// parses x-www-form-urlencoded
app.use(express.urlencoded());

app.get('/', function (req, res) {
  if (req.signedCookies.encryptedCookie) {
    res.send('Remembered and encrypted :). Click to <a href="/forget">forget</a>! Click here to decrypt.' +
      '<form action="/decryptCookies" method="POST"> <button type="submit">decrypt</button> </form>'
    );
  } else {
    res.send(
      '<form method="post"><p>Check to <label>' +
        '<input type="checkbox" name="encryptedCookie"/> remember me and encrypt me</label> ' +
        '<input type="submit" value="Submit"/>.</p></form>',
    );
  }
});

app.get('/forget', function (req, res) {
  res.clearCookie('encryptedCookie');
  res.redirect(req.get('Referrer') || '/');
});

const key = crypto.randomBytes(32);

app.post('/', function (req, res) {
  var minute = 60000;

  if (req.body && req.body.encryptedCookie) {
    res.cookie(
      'encryptedCookie',
      'I like to hide by cookies under the sofa now',
      { signed: true, maxAge: minute  },
      { key },
    );
  }
  res.redirect(req.get('Referrer') || '/');
});

app.post('/decryptCookies', function (req, res) {
  const encryptedCookie = req.signedCookies.encryptedCookie;

  const decryptedCookie = res.decryptCookie(encryptedCookie, key);

  res.send(decryptedCookie + '<br> <a href="/">Go back to main page</a>');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
