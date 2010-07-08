
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    connect = require('connect');

// Path to our public directory

var pub = __dirname + '/public';

// Auto-compile sass to css
// and then serve with connect's staticProvider

var app = module.exports = express.createServer(
    connect.compiler({ src: pub, enable: ['sass'] }),
    connect.staticProvider(pub)
);

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Enable auto-reloading of view contents when changed
// with an interval of 2000 milliseconds

app.set('reload views', 2000);
// or app.enable('reload views'); for defaults

// Re-compile

// Dummy users
var users = [
    { name: 'tj', email: 'tj@sencha.com' },
    { name: 'ciaran', email: 'ciaranj@gmail.com' },
    { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

app.get('/', function(req, res){
    res.render('users.jade', {
        locals: {
            users: users
        }
    });
});