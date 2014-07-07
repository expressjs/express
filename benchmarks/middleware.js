
var http = require('http');
var express = require('..');
var app = new express.Router();

// number of middleware

var n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
  app.use(function(req, res, next){
    next();
  });
}

var body = new Buffer('Hello World');

app.use(function(req, res, next){
  res.statusCode = 200;
  res.end(body);
});

http.createServer(app).listen(3333);
