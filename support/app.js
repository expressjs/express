
/**
 * Module dependencies.
 */

var express = require('../');

var app = express()
  , blog = express()
  , admin = express();

<<<<<<< HEAD
blog.use('/admin', admin);
=======
// app.use(express.logger('dev'))
>>>>>>> feature/send-etag
app.use('/blog', blog);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.self = true;

var repo = require('../package.json');

app.get('/render', function(req, res){
  res.render('hello');
});

<<<<<<< HEAD
admin.get('/', function(req, res){
  res.send('Hello World\n');
=======
app.get('/json/small', function(req, res){
  res.send(repo);
});

app.get('/json/large', function(req, res){
  var repos = [];
  var n = 10;
  while (n--) repos.push(repo);
  res.send(repos);
>>>>>>> feature/send-etag
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