
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../lib/express');

// $ npm install connect-redis
var RedisStore = require('connect-redis');

var app = express.createServer(
  express.logger(),

  // Required by session() middleware
  express.cookieDecoder(),

  // Populates:
  //   - req.session
  //   - req.sessionStore
  //   - req.sessionID (or req.session.id)
  express.session({ secret: 'keyboard cat', store: new RedisStore })
);

app.get('/', function(req, res){
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.listen(3000);
console.log('Express app started on port 3000');