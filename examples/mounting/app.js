/**
 * Module dependencies.
 */

var express = require('../../')
  , blog = require('../blog/app');

var app = module.exports = express();

app.use(express.cookieParser('keyboard cat'));
app.use(express.session());

// mount the blog. the blog app is written using the "base"
// local variable, allowing its urls to adjust to wherever
// we wish to mount it.
app.use('/blog', blog);

app.get('/', function(req, res){
  res.send('Visit <a href="/blog">/blog</a>');
})

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}