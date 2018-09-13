var request = require('supertest')

if (process.env.HTTP2_TEST) {
  var http2 = require('http2')
  var http2wrapper = require('./http2wrapper')
  var agent = require('superagent')
  var tls = require('tls')
  agent.protocols = {
    'http:': http2wrapper.setProtocol('http:'),
    'https:': http2wrapper.setProtocol('https:'),
  }
  request.Test.serverAddress = function(app, path, host){
    var addr = app.address();
    var port;
    var protocol;

    if (!addr) this._server = app.listen(0);
    port = app.address().port;

    protocol = app instanceof tls.Server ? 'https' : 'http';
    return protocol + '://' + (host || '127.0.0.1') + ':' + port + path;
  };
  var originalRequest = request;
  request = function (app) {
    if (typeof app === 'function') {
      app = http2.createServer(app);
    }
    return originalRequest(app);
  }
}


module.exports = request
