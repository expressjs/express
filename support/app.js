
/**
 * Module dependencies.
 */

var express = require('../');

var app = express()
  , blog = express();

app.use('/blog', blog);

blog.get('/', function(req, res){
  res.send('Hello World\n');
});

app.get('/', function(req, res){
  res.send('Hello World\n');
});

app.get('/json', function(req, res){
  res.send({ name: 'Tobi', role: 'admin' });
});

function foo(req, res, next) {
  next();
}

app.get('/middleware', foo, foo, foo, foo, function(req, res){
  res.send('Hello World\n');
});

var n = 100;
while (n--) {
  app.get('/foo', foo, foo, function(req, res){
    
  });
}

app.get('/match', function(req, res){
  res.send('Hello World\n');
});

app.listen(8000);