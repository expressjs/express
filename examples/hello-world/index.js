'use strict'

// Load express from the repo root instead of node_modules
const express = require('../../');

const app = module.exports = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
