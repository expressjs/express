
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

// dynamic helpers are simply functions that are invoked
// per request (once), passed both the request and response
// objects. These can be used for request-specific
// details within a view, such telling the layout which
// scripts to include.
app.dynamicHelpers({
  // by simply returning an object here
  // we can set it's properties such as "page.title"
  // within a view, and it remains specific to that request,
  // so it would be valid to do:
  //   page.title = user.name + "'s account"
  page: function() {
    return {};
  },

  // the scripts array here is assigned once,
  // so by returning a closure, we can use script(path)
  // in a template, instead of something like
  // scripts.push(path).
  script: function(req){
    req._scripts = [];
    return function(path){
      req._scripts.push(path);
    }
  },

  // to expose our scripts array for iteration within
  // our views (typically the layout), we simply return it
  // here, and since composite types are mutable, it will
  // contain all of the paths pushed with the helper above.
  scripts: function(req){
    return req._scripts;
  }
});

app.get('/', function(req, res){
  res.render('users', { users: users });
});

app.listen(3000);
console.log('Express app started on port 3000');