
/*!
 * Express - test
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var methods = require('./router/methods')
  , http = require('http');

var server = http.Server(app);
server.listen(0, function(){
  var addr = server.address();
  var req = http.request({
      method: 'GET'
    , path: '/'
    , host: addr.address
    , port: addr.port
  });

  req.on('response', function(res){
    console.log(res.statusCode);
  });

  req.end();
})

exports.request = function(method, path, fn){
  this._server = this._server || http.Server(this);
};