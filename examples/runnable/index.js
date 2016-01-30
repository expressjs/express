var express = require('../../');
var api = require('./middlewares/api');

module.exports = exports = express();

exports.use('/api', api);

exports.get('/', function(req, res) {
  res.send('Homepage');
});

exports.runnable(8000, 'localhost', function(error) {
  if (error) {
    return console.error(error);
  }
  console.log('Running!');
});
