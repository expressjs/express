
var express = require('..');
var app = express();

// number of middleware

var n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
  app.use(function(req, res, next){
    next();
  });
}

app.use(function(req, res){var express = require('..');
var app = express();

// Number of middleware
var n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

// Adding a middleware to log the request processing time
app.use(function(req, res, next){
  var start = process.hrtime();
  res.on('finish', () => {
    var diff = process.hrtime(start);
    console.log(`Request processing time: ${diff[0] * 1e9 + diff[1]} nanoseconds`);
  });
  next();
});

// Adding user-defined middlewares
while (n--) {
  app.use(function(req, res, next){
    next();
  });
}

app.use(function(req, res){
  res.send('Hello World');
});

app.listen(3333, () => console.log('Server running on port 3333'));

  res.send('Hello World')
});

app.listen(3333);
