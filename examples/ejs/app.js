
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

// Register ejs as .html

app.register('.html', require('ejs'));

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Dummy users
var users = [
    { name: 'tj', email: 'tj@sencha.com' }
  , { name: 'ciaran', email: 'ciaranj@gmail.com' }
  , { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

app.get('/', function(req, res){
  res.render('users', { users: users });
});

app.listen(3000);
console.log('Express app started on port 3000');