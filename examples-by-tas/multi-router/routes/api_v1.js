
var express = require('../../express');
var v1 = express.Router();

v1.get('/', function(req, res) {
	res.send('Hello from APIv1 root route.');
});

v1.get('/users', function(req, res) {
	res.send('List of APIv1 users.');
});

module.exports = v1;
