'use strict';

// NOTE: This example uses the local Express source, not the npm-installed version
var express = require('../../');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
