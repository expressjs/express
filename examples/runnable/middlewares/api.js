var express = require('../../../');

module.exports = exports = express();

exports.get('/', function(req, res) {
  res.send('Api');
});

exports.runnable();
