
var fs = require('fs'),
    http = require('http')

http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': 11 })
  res.end('Hello World', 'ascii')
}).listen(3000, 'localhost')
