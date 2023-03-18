'use strict'
const path = require('path');
const node_modules = path.join(__dirname, 'node_modules');
var express = require(path.join(node_modules, 'express'));

var app = module.exports = express()

app.get('/', function(req, res){
  res.send('Hello World');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
