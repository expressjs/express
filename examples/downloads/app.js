
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
  // a callback as shown below
  res.download(path, function(err){
    // if an error occurs in this callback
    // the file most likely does not exist,
    // and it's safe to respond or next(err)
    if (err) return next(err);

    // the file has been transferred, do not respond
    // from here, though you may use this callback
    // for stats etc.
    console.log('transferred %s', path);
  }, function(err){
    // this second optional callback is used when
    // an error occurs during transmission
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