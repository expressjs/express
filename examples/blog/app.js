
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

// Define our main application

var app = express.createServer();

app.get('/', function(req, res){
    res.send('<p>Visit /blog</p>');
});

// "mount" our blog app to the /blog path
app.use('/blog', require('./blog'));

app.listen(3000);