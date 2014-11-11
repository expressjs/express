var debug = require('debug')('trace-example');
var express = require('../../');


function random() {
  return Math.random().toString(36).slice(2);
};


var app = express();

app.use(function (req, res, next) {
  res.start = Date.now()
  res.id = random();
  res.trace('start', new Date());
  next();
});

app.use(function (req, res, next) {
  res.trace('wait:before');
  setTimeout(function () {
    res.trace('wait:after');
    next();
  }, Math.random() * 100);
})

app.get('/', function (req, res, next) {
  res.trace('user.id', random());
  res.trace('some.event', random(), random());
  res.trace('another.event', random(), random());
  res.set('X-Response-Time', (Date.now() - res.start) + 'ms');
  res.send('Hello world!');
  next();
});

app.use(function (req, res, next) {
  res.trace('finish');
});

app.instrument(function (app, req, res, event, date, args) {
  debug(res.id, event, args.join(' '));
});

var port = process.env.PORT || 3210;

app.listen(port);
console.log('Trace example for Express listening on port %s', port);
