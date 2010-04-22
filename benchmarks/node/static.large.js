
var fs = require('fs'),
    http = require('http')

http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Transfer-Encoding': 'chunked' })
  fs.createReadStream('benchmarks/shared/huge.js')
    .addListener('data', function(data){
      res.write(data, 'binary')
    })
    .addListener('end', function(){
      res.end()
    })
}).listen(3000, 'localhost')
