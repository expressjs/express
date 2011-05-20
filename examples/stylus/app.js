
/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , stylus = require('stylus');

var app = express.createServer();

// $ npm install stylus

// completely optional, however
// the compile function allows you to
// define additional functions exposed to Stylus,
// alter settings, etc

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true);
};

// add the stylus middleware, which re-compiles when
// a stylesheet has changed, compiling FROM src,
// TO dest. dest is optional, defaulting to src

app.use(stylus.middleware({
    src: __dirname + '/views'
  , dest: __dirname + '/public'
  , compile: compile
}));


// minimal setup both reading and writting to ./public
// would look like:
//   app.use(stylus.middleware({ src: __dirname + '/public' }));

// the middleware itself does not serve the static
// css files, so we need to expose them with staticProvider

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  res.render('index.jade');
});

app.listen(3000);
console.log('server listening on port 3000');