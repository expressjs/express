var express = require('express');
var APIv1 = require('./api_v1');
var APIv2 = require('./api_v2');
var util = require('util');

var app = express();
app.set('port', 8080);

app.use('/api/v1', APIv1);
app.use('/api/v2', APIv2);

app.get('/', function(req, res) {
  res.send('Hello form root route.');
});


app.listen(app.get('port'), function(){
  util.log('Server listening on port ' + app.get('port'))
});
