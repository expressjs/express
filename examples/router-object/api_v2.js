var APIv2 = require('express').Router();

APIv2.get('/', function(req, res) {
  res.send('Hello from APIv2 root route.');
});

module.exports = APIv2;
