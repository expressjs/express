
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