

var express = require('../..');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// pass the express to the connect redis module
// allowing it to inherit from session.Store
var RedisStore = require('connect-redis')(session);

var app = express();

app.use(logger('dev'));

// Required by session() middleware
// pass the secret for signed cookies
// (required by session())
app.use(cookieParser('keyboard cat'));

// Populates req.session
app.use(session({ store: new RedisStore }));

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
