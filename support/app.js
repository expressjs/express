
/**
 * Module dependencies.
 */

var express = require('../');

var app = express()
  , blog = express()
  , admin = express();

blog.use('/admin', admin);
app.use('/blog', blog);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.self = true;

app.get('/render', function(req, res){
  res.render('hello');
});

admin.get('/', function(req, res){
  res.send('Hello World\n');
});

blog.get('/', function(req, res){
  res.send('Hello World\n');
});

app.get('/', function(req, res){
  res.send('Hello World\n');
});

app.get('/json', function(req, res){
  res.send({ name: 'Tobi', role: 'admin' });
});

app.get('/json/:n', function(req, res){
  var n = ~~req.params.n;
  var arr = [];
  var obj = { name: 'Tobi', role: 'admin' };
  while (n--) arr.push(obj);
  res.send(arr);
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
