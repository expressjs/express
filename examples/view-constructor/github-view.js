
/**
 * Module dependencies.
 */

var http = require('http')
  , path = require('path')
  , extname = path.extname

// defining the new View constructor that only knows about remote files from github
function GithubView(name, options){
  this.name = name;
  options = options || {};
  this.engine = options.engines[extname(name)];
  this.path = '/' + options.root + '/master/' + name; // where `root` is username/repo
}
GithubView.prototype.render = function(options, fn){
  var self = this
    , options = {
        host: 'rawgithub.com',
        port: 80,
        path: this.path,
        method: 'GET'
      };
  http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (str) {
      self.engine(str, options, fn);
    });
  }).end();
};

module.exports = GithubView;