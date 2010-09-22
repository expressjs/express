
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session());

app.get('/', function(req, res){
    res.render('login');
});

app.listen(3000);
console.log('Express started on port 3000');