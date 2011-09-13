
/**
 * Module dependencies.
 */

var express = require('../../');

app = express.createServer();

// load the config for this environment (NODE_ENV)

var config = require('./config')[app.settings.env];

// apply settings

for (var key in config) app.set(key, config[key]);

// apply middleware

config.middleware.forEach(app.use.bind(app));

app.get('/', function(req, res){
  res.render('index', { layout: false });
});

app.listen(3000);