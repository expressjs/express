'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');

// Automatically loads .env, .env.[NODE_ENV], and .env.local

// Option 1: Simple load
express.loadEnv();

// Option 2: Load with file watching
// Uncomment below to enable automatic reloading when .env files change
/*
 const unwatch = express.loadEnv({
  watch: true,
  onChange: (changed, loaded) => {
    console.log('Environment variables changed:', changed);
  },
  onError: (err) => {
    console.error('Error reloading .env:', err.message);
  }
});

// Cleanup on shutdown
process.on('SIGINT', () => {
  unwatch();
  process.exit();
});

*/

var app = module.exports = express();
var logger = require('morgan');

// custom log format
if (process.env.NODE_ENV !== 'test') app.use(logger(':method :url'))

app.get('/', function(req, res){
  var nodeEnv = process.env.NODE_ENV || 'development';
  res.send('<h1>Environment Variables Example</h1>'
    + '<p>This example demonstrates how to use Express built-in .env file loading.</p>'
    + '<p><strong>Current Environment:</strong> ' + nodeEnv + '</p>'
    + '<ul>'
    + '<li><a href="/env">View loaded environment variables</a></li>'
    + '<li><a href="/config">View application configuration</a></li>'
    + '</ul>'
    + '<hr>'
    + '<p><strong>Features:</strong></p>'
    + '<ul>'
    + '<li>Automatically loads .env, .env.[NODE_ENV], and .env.local files</li>'
    + '<li>Optional file watching for automatic reloads (see source code)</li>'
    + '<li>Environment-specific configuration</li>'
    + '<li>Cascading values with .env.local overrides</li>'
    + '</ul>'
    + '<hr>'
    + '<p><strong>Try running with different environments:</strong></p>'
    + '<pre>NODE_ENV=development node index.js\nNODE_ENV=production node index.js</pre>'
    + '<p><strong>Enable watch mode:</strong> Uncomment the watch example in index.js and modify your .env file to see live updates!</p>');
});

app.get('/env', function(req, res){
  // Display some environment variables
  var safeEnvVars = {
    APP_NAME: process.env.APP_NAME,
    APP_ENV: process.env.APP_ENV,
    PORT: process.env.PORT,
    DEBUG: process.env.DEBUG,
    API_URL: process.env.API_URL,
    MAX_ITEMS: process.env.MAX_ITEMS
  };

  res.send('<h1>Environment Variables</h1>'
    + '<p>The following variables were loaded from .env file:</p>'
    + '<pre>' + JSON.stringify(safeEnvVars, null, 2) + '</pre>'
    + '<p><a href="/">Back to home</a></p>');
});

app.get('/config', function(req, res){
  // Use environment variables for configuration
  var config = {
    appName: process.env.APP_NAME,
    environment: process.env.APP_ENV,
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG === 'true',
    apiUrl: process.env.API_URL,
    maxItems: parseInt(process.env.MAX_ITEMS) || 10
  };

  res.send('<h1>Application Configuration</h1>'
    + '<p>Configuration built from environment variables:</p>'
    + '<pre>' + JSON.stringify(config, null, 2) + '</pre>'
    + '<p><a href="/">Back to home</a></p>');
});

/* istanbul ignore next */
if (!module.parent) {
  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log('Express started on port ' + port);
  console.log('App Name: ' + (process.env.APP_NAME || 'Not set'));
  console.log('Environment: ' + (process.env.APP_ENV || 'Not set'));
}
