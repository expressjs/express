
/**
 * Module dependencies.
 */

var express = require('../../')
  , app = module.exports = express();

app.get('/', function(req, res){
  res.send('<ul>'
    + '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
    + '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
    + '<li>Download <a href="/files/1">test_žćčđš.txt</a>.</li>'
    + '<li>Download <a href="/files/2">amazing.txt as 你好.txt</a>.</li>'
    + '</ul>');
});

app.get('/files/1', function(req, res, next){
  var path = __dirname + '/files/test_žćčđš.txt';

  res.download(path);
});

app.get('/files/2', function(req, res, next){
  var path = __dirname + '/files/amazing.txt';

  res.download(path, '你好.txt');
});

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/:file(*)', function(req, res, next){
  var file = req.params.file
    , path = __dirname + '/files/' + file;

  res.download(path);
});




// error handling middleware. Because it's
// below our routes, you will be able to
// "intercept" errors, otherwise Connect
// will respond with 500 "Internal Server Error".
app.use(function(err, req, res, next){
  // special-case 404s,
  // remember you could
  // render a 404 template here
  if (404 == err.status) {
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  } else {
    next(err);
  }
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}