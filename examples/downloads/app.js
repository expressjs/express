
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){
  res.send('<ul>'
    + '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
    + '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
    + '</ul>');
});

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/:file(*)', function(req, res, next){
  var file = req.params.file
    , path = __dirname + '/files/' + file;
  // either res.download(path) and let
  // express handle failures, or provide
  // a callback
  res.download(path, function(err){
    if (err) return next(err);
    // the response has invoked .end()
    // so you cannnot respond here (of course)
    // but the callback is handy for statistics etc.
    console.log('transferred %s', path);
  });
});

app.error(function(err, req, res, next){
  if ('ENOENT' == err.code) {
    res.send('Cant find that file, sorry!');
  } else {
    // Not a 404
    next(err);
  }
});

app.listen(3000);
console.log('Express started on port 3000');