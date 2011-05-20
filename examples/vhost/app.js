
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

// Edit /etc/vhosts

// First app

var one = express.createServer();

one.use(express.logger());

one.get('/', function(req, res){
  res.send('Hello from app one!')
});

one.get('/:sub', function(req, res){
  res.send('requsted ' + req.params.sub);
});

// App two

var two = express.createServer();

two.get('/', function(req, res){
  res.send('Hello from app two!')
});

// Redirect app

var redirect = express.createServer();

redirect.all('*', function(req, res){
  console.log(req.subdomains);
  res.redirect('http://localhost:3000/' + req.subdomains[0]);
});

// Main app

var app = express.createServer();

app.use(express.vhost('*.localhost', redirect))
app.use(express.vhost('localhost', one));
app.use(express.vhost('dev', two));

app.listen(3000);
console.log('Express app started on port 3000');