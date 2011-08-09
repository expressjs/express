
/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , url = require('url');

var app = express.createServer();

app.set('views', __dirname + '/views');

// map .html to ejs module
app.register('html', require('ejs'));
app.set('view engine', 'html');

// set default layout, usually "layout"
app.locals.layout = 'layouts/default';

// expose the current path as a view local
app.use(function(req, res, next){
  res.locals.path = url.parse(req.url).pathname;
  next();
});

app.get('/', function(req, res){
  res.render('page');
});

app.get('/alternate', function(req, res){
  res.render('page', { layout: 'layouts/alternate' });
});

app.get('/defined-in-view', function(req, res){
  // note that we do not explicitly
  // state the layout here, the view does,
  // although we could do it here as well.
  res.render('pages');
});

app.listen(3000);
console.log('Express app started on port 3000');
