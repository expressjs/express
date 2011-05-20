
/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , blog = require('../blog/app');

var app = express.createServer();

app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));

// mount the blog. the blog app is written using the "base"
// local variable, allowing it's urls to adjust to wherever
// we wish to mount it.
app.use('/blog', blog);

app.get('/', function(req, res){
  res.send('Visit <a href="/blog">/blog</a>');
});

app.listen(3000);
console.log('Server listening on port 3000');