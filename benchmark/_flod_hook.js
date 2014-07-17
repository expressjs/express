
var fs = require('fs');
var onFinish = require('finished');

module.exports = {
  'express': {
    '4.0.0': {
      'start': express4_start,
      'stop': express4_stop,
      'hook': express4_hook
    }
  }
};

function express4_hook(options, app, send) {
  app.use(function (req, res, next) {
    onFinish(res, function () {
      send({action: 'request', data: {}});
    });
    next();
  });
}

function express4_start(options, app, send, data) {
  var listen = app.listen;
  app.listen = function _listen() {
    var server = options.server = listen.apply(this, arguments);
    server.on('listening', function () {
      var addr = this.address();
      var resp = data || {};

      resp.host = addr.address;
      resp.port = addr.port;

      send({
        action: 'started',
        data: resp
      });
    });
  };
}

function express4_stop(options, app) {
  options.server.close(function () {
    fs.fsyncSync(process.stdout.fd);
    fs.fsyncSync(process.stderr.fd);
    process.exit();
  });
}
