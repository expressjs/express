
/**
 * Module dependencies.
 */

var express = require('../../lib/express')
  , redis = require('redis')
  , app = express.createServer()
  , db = { users: [] };

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());

// pretend db is a database, could be
// whatever you like
require('./boot')(app, db);

app.listen(3000);
console.log('Express app started on port 3000');

