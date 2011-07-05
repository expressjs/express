
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

// pass the express to the connect redis module
// allowing it to inherit from express.session.Store
var RedisStore = require('connect-redis')(express);

var app = express.createServer();

app.use(express.favicon());

// request logging
app.use(express.logger());

// required to parse the session cookie
app.use(express.cookieParser());

// Populates:
//   - req.session
//   - req.sessionStore
//   - req.sessionID (or req.session.id)

app.use(express.session({ secret: 'keyboard cat', store: new RedisStore }));

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