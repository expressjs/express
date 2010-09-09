
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

// Path to our public directory

var pub = __dirname + '/public';

// Auto-compile sass to css with "compiler"
// and then serve with connect's staticProvider

var app = express.createServer(
    express.compiler({ src: pub, enable: ['sass'] }),
    express.staticProvider(pub)
);

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Set our default template engine to "jade"
// which prevents the need for extensions (although you can still mix and match)
app.set('view engine', 'jade');

// Dummy users
var users = [
    { name: 'tj', email: 'tj@sencha.com' },
    { name: 'ciaran', email: 'ciaranj@gmail.com' },
    { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

app.get('/', function(req, res){
    res.render('users', {
        locals: {
            users: users
        }
    });
});

app.listen(3000);