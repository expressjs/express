
/**
 * Module dependencies.
 */

var express = require('./../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){
    res.send('<ul>'
        + '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
        + '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
        + '</ul>');
});

app.get('/files/*', function(req, res){
    var file = req.params[0];
    res.download(__dirname + '/files/' + file);
});

app.error(function(err, req, res, next){
    if (process.ENOENT == err.errno) {
        res.send('Cant find that file, sorry!');
    } else {
        // Not a 404
        next(err);
    }
});

app.listen(3000);
console.log('Express started on port 3000');