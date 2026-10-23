/**
 * Module dependencies.
 */

var express = require('../..');
var fs = require('fs');
var path = require('path');
var https = require('https');

var app = module.exports = express();

app.use(function(req, res) {
  res
    .set('Content-Type', 'text/html;charset=utf-8')
    .status(200)
    .send('<h1>Hello world from a SSL-enabled server!</h1>')
    .end();
});

/* istanbul ignore next */
if (!module.parent) {
  try {
    /* These certificates should be created manually as specified in the
     * Readme.md */
    var certsPath = path.join(__dirname, 'certs');
    var options = {
      key: fs.readFileSync(path.join(certsPath, 'key.pem')),
      cert: fs.readFileSync(path.join(certsPath, 'cert.pem'))
    };

    /* Instead of using app.listen() directly, you should create a regular
     * Node.js HTTPS server and place the Express server as its only midware. */
    var httpsServer = https.createServer(options, app);
    var PORT = 8443;
    httpsServer.listen(PORT, function() {
      console.log('SSL Express server responds in https://localhost:' + PORT);
    });
  } catch(er) {
    console.error('Please create the certificates manually first according to the Readme.md.');
  }
}
