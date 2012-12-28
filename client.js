
var http = require('http');

var times = 50;

while (times--) {
  var req = http.request({
      port: 3000
    , method: 'POST'
    , headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  req.on('response', function(res){
    console.log(res.statusCode);
  });

  var n = 500000;
  while (n--) {
    req.write('foo=bar&bar=baz&');
  }

  req.write('foo=bar&bar=baz');

  req.end();
}