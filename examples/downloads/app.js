
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

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/:file(*)', function(req, res){
  var file = req.params.file;
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