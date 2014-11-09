var express = require('../..');

var app = module.exports = express();

app.use('/api/v1', require('./controllers/api_v1'));
app.use('/api/v2', require('./controllers/api_v2'));

app.get('/', function(req, res) {
  res.send('Hello form root route.');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
