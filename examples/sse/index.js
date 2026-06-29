'use strict'

var express = require('../../');
var path = require('node:path');

var app = module.exports = express();

// serve the client page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* -server-sent events endpoint
  -send unnamend event
  -The event sends ticks to the client every second.
  -stops sending them when the client disconnects
*/
app.get('/events', function (req, res) {
  var sse = res.sse();

  sse.send({ message: 'connected', at: new Date().toISOString() });

  var n = 0;
  var timer = setInterval(function () {
    sse.send({ now: new Date().toISOString() }, { event: 'tick', id: ++n });
  }, 1000);

  req.on('close', function () {
    clearInterval(timer);
    sse.close();
  });
});


if (!module.parent) {
  app.listen(3000);
  console.log('Express sse-server started on port 3000');
}


