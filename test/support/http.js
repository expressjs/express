
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , methods = require('../../').methods
  , http = require('http');

module.exports = request;

function request(app) {
  return new Request(app);
}

function Request(app) {
  var self = this;
  this.data = [];
  this.header = {};
  this.app = app;
  if (!this.server) {
    this.server = http.Server(app);
    this.server.listen(0, function(){
      self.addr = self.server.address();
      self.listening = true;
    });
  }
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Request.prototype.__proto__ = EventEmitter.prototype;

methods.forEach(function(method){
  Request.prototype[method] = function(path){
    return this.request(method, path);
  };
});

Request.prototype.set = function(field, val){
  this.header[field] = val;
  return this;
};

Request.prototype.write = function(data){
  this.data.push(data);
  return this;
};

Request.prototype.request = function(method, path){
  this.method = method;
  this.path = path;
  return this;
};

Request.prototype.expect = function(body, fn){
  this.end(function(res){
    if ('number' == typeof body) {
      res.statusCode.should.equal(body);
    } else {
      res.body.should.equal(body);
    }
    fn();
  });
};

Request.prototype.end = function(fn){
  var self = this;

  if (this.listening) {
    var req = http.request({
        method: this.method
      , port: this.addr.port
      , host: this.addr.address
      , path: this.path
      , headers: this.header
    });

    this.data.forEach(function(chunk){
      req.write(chunk);
    });
    
    req.on('response', function(res){
      var buf = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk });
      res.on('end', function(){
        res.body = buf;
        fn(res);
      });
    });

    req.end();
  } else {
    this.server.on('listening', function(){
      self.end(fn);
    });
  }

  return this;
};
