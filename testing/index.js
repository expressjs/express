
/**
 * Module dependencies.
 */

var express = require('../')
  , http = require('http');

var app = express();

app.use(express.logger('dev'));
app.use(express.static(__dirname));

http.createServer(app).listen(3000);
console.log('listening on port 3000');