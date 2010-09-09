
/**
 * Module dependencies.
 */

var express = require('./../../../lib/express'),
    fs = require('fs');

// Export our app as the module
var app = module.exports = express.createServer();

// Set views directory
app.set('views', __dirname + '/views');

// Load our posts
var posts = JSON.parse(fs.readFileSync(__dirname + '/posts.json', 'utf8'));

// Set our default view engine to "ejs"
app.set('view engine', 'ejs');

app.dynamicHelpers({
    basepath: function(){
        // "this" is the app, we can
        // dynamically provide the "home"
        // setting to all views
        return this.set('home');
    }
});

app.get('/', function(req, res){
    res.render('index', {
        locals: {
            posts: posts
        }
    });
});

app.get('/post/:id', function(req, res){
    var id = req.params.id;
    res.render('post', {
        locals: {
            post: posts[id]
        }
    });
});