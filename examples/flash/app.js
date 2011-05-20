
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

// App with session support

var app = express.createServer(
    express.cookieParser()
  , express.session({ secret: 'keyboard cat' })
);

// View settings

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.dynamicHelpers({
  // express-messages is a dynamicHelper that
  // renders the flash messages to HTML for you
  //    $ npm install express-messages
  messages: require('express-messages')
});

app.dynamicHelpers({
  // Another dynamic helper example. Since dynamic
  // helpers resolve at view rendering time, we can
  // "inject" the "page" local variable per request
  // providing us with the request url.
  page: function(req, res){
    return req.url;
  } 
});

app.get('/', function(req, res){
  // Not very realistic notifications but illustrates usage
  req.flash('info', 'email queued');
  req.flash('info', 'email sent');
  req.flash('error', 'delivery failed');
  res.render('index');
});

app.listen(3000);
console.log('Express app started on port 3000');