'use strict'

/**
 * Module dependencies.
 */

var express = require('../..');
var logger = require('morgan');
var vhost = require('vhost');

/*
edit /etc/hosts:

127.0.0.1       foo.example.com
127.0.0.1       bar.example.com
127.0.0.1       example.com
*/

// Main server app

var main = express();

if (require.main === module) main.use(logger('dev'));

main.get('/', function(req, res){
  res.send('Hello from main app!');
});

main.get('/:sub', function(req, res){
  res.send('requested ' + req.params.sub);
});

// Redirect app

var redirect = express();

redirect.use(function(req, res){
  if (require.main === module) console.log(req.vhost);
  res.redirect('http://example.com:3000/' + req.vhost[0]);
});

// Vhost app

var app = module.exports = express();

app.use(vhost('*.example.com', redirect)); // Serves all subdomains via Redirect app
app.use(vhost('example.com', main)); // Serves top level domain via Main server app

/* istanbul ignore next */
if (require.main === module) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
