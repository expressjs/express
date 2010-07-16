
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    fs = require('fs');

// Export our app as the module
var app = module.exports = express.createServer();

// Set views directory
app.set('views', __dirname + '/views');

// Load our posts
var posts = JSON.parse(fs.readFileSync(__dirname + '/posts.json', 'utf8'));

// Set our default view engine to "ejs"
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index', {
        locals: {
            posts: posts
        }
    });
});
