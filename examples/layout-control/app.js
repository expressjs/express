
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

app.set('views', __dirname + '/views');

// set default layout, usually "layout"
app.set('view options', { layout: 'layouts/default' });

// Set our default template engine to "ejs"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('pages/default');
});

app.get('/alternate', function(req, res){
  // note that we do not explicitly
  // state the layout here, the view does,
  // although we could do it here as well.
  res.render('pages/alternate');
});

app.listen(3000);
console.log('Express app started on port 3000');
