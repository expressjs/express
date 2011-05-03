
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../')
  , path = require('path')
  , exec = require('child_process').exec;

/**
 * Error handler.
 */

function errorHandler(err, req, res, next) {
  var parts = err.stack.split('\n')[1].split(/[()]/)[1].split(':')
    , filename = parts.shift()
    , basename = path.basename(filename)
    , line = parts.shift()
    , col = parts.shift();

  exec('say '
    + err.message
    + ' on line ' + line
    + ' of ' + basename);

  res.send(500);
}

var app = express.createServer();

app.get('/', function(req, res){
  throw new Error('something exploded');
});

app.use(errorHandler);

app.listen(3000);