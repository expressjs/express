
var express = require('../../express');
var v2 = express.Router();

v2.get('/', function(req, res) {
	res.send('Hello from APIv2 root route.');
});

v2.get('/users', function(req, res) {
	res.send('List of APIv2 users.');
});

module.exports = v2;
