
/**
 * Module dependencies.
 */

var express = require('../')
  , crypto = require('crypto');

var app = express.createServer();

app.get('/', function(req, res){
  res.set({ foo: 'bar', bar: 'baz' });
  res.set('X-API-Key', 'foobarbaz');
  res.send('ok');
});

app.listen(3000);