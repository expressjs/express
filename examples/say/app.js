
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../')
  , path = require('path')
  , exec = require('child_process').exec
  , fs = require('fs');

/**
 * Error handler.
 */

function errorHandler(err, req, res, next) {
  var parts = err.stack.split('\n')[1].split(/[()]/)[1].split(':')
    , filename = parts.shift()
    , basename = path.basename(filename)
    , lineno = parts.shift()
    , col = parts.shift()
    , lines = fs.readFileSync(filename, 'utf8').split('\n')
    , line = lines[lineno - 1].replace(/\./, ' ');

  exec('say '
    + err.message
    + ' on line ' + lineno
    + ' of ' + basename + '.'
    + ' The contents of this line is '
    + ' "' + line + '".');

  res.send(500);
}

var app = express.createServer();

app.get('/', function(request, response){
  if (request.is(foo)) {
    
  }
});

app.use(errorHandler);

app.listen(3000);