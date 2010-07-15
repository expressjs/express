
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer();

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Dummy users
var users = [
    { name: 'tj', email: 'tj@sencha.com' },
    { name: 'ciaran', email: 'ciaranj@gmail.com' },
    { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

app.get('/', function(req, res){
    res.render('users.ejs', {
        locals: {
            users: users
        }
    });
});

app.listen(3000);