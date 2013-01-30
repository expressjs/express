/**
 * Module dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , utils = require('./utils')
  , dirname = path.dirname
  , basename = path.basename
  , extname = path.extname
  , exists = fs.existsSync || path.existsSync 
  , join = path.join;

/**
 * Expose `View`.
 */

module.exports = View;

/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name 
 *   - `engines` template engine require() cache 
 *   - `root` root path for view lookup 
 *
 * @param {String} name
 * @param {Object} options
 * @api private
 */

function View(name, options) {
  options = options || {};
  this.name = name;
  this.root = options.root;
  var engines = options.engines;
  this.defaultEngine = options.defaultEngine;
  var ext = this.ext = extname(name);
  if (!ext) name += (ext = this.ext = ('.' != this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
  this.path = this.lookup(name);
}

/**
 * Lookup view by the given `path`
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

View.prototype.lookup = function(path){
  var ext = this.ext, finalpath;

  // <path>.<engine>
  if (!utils.isAbsolute(path)){ 
    if (typeof this.root === "string") {
      path = join(this.root, path);
      if (exists(path)) return path;
    }
    else if (this.root instanceof Array) {
      var c = 0; // count array index
      while (c < this.root.length) {
        finalpath = join(this.root[c], path);
        if (exists(finalpath)) return finalpath;
        c = c + 1;
      }
    }
  }
  // <path>/index.<engine>
  path = join(dirname(path), basename(path, ext), 'index' + ext);
  if (exists(path)) return path;
};

/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

View.prototype.render = function(options, fn){
  this.engine(this.path, options, fn);
};
