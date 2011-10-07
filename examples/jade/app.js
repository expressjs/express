
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

// Path to our public directory

var pub = __dirname + '/public';

// Auto-compile sass to css with "compiler"
// and then serve with connect's staticProvider

var app = express.createServer();
app.use(express.logger('dev'));
app.use(express.compiler({ src: pub, enable: ['sass'] }));
app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler({ dump: true, stack: true }));

// we're using jade's template inheritance, so we dont need
// the express layout concept
app.set('view options', { layout: false });

// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');

// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');

function User(name, email) {
  this.name = name;
  this.email = email;
}

// Dummy users
var users = [
    new User('Tobi', 'tobi@learnboost.com')
  , new User('Loki', 'loki@learnboost.com')
  , new User('Jane', 'jane@learnboost.com')
];

app.get('/', function(req, res){
  res.render('users', { users: users });
});

app.get('/users/list', function(req, res){
  // use "object" to utilize the name deduced from
  // the view filename. The examples below are equivalent

  //res.partial('users/list', { object: users });
  res.partial('users/list', { list: users });
});

app.get('/user/:id', function(req, res){
  res.partial('users/user', users[req.params.id]);
});

app.listen(3000);
console.log('Express app started on port 3000');
