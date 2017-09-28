
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

app.use(function(req, res, next){
  res.send('Hello World')
});

app.listen(3333);
