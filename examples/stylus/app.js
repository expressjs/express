
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , stylus = require('stylus');

var app = express.createServer();

// $ npm install stylus

function compile(str, path, fn) {
  stylus(str)
    .set('filename', path)
    .set('compress', true)
    .render(fn);
};

app.use(stylus.middleware({
    src: __dirname + '/views'
  , dest: __dirname + '/public'
  , compile: compile
}));

app.use(app.router);

app.use(express.staticProvider(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.jade');
});

app.listen(3000);
console.log('server listening on port 3000');