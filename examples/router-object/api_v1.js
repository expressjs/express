var APIv1 = require('express').Router();

APIv1.get('/', function(req, res) {
  res.send('Hello from APIv1 root route.');
});

module.exports = APIv1;
