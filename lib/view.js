
/*!
 * Express - View
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , dirname = path.dirname
  , basename = path.basename
  , extname = path.extname
  , exists = path.existsSync
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
  this.ext = extname(name);
  if (!this.ext) name += '.' + (this.ext = this.defaultEngine);
  this.engine = engines[this.ext] || (engines[this.ext] = require(this.ext));
  this.path = this.lookup(name);
  this.string = fs.readFileSync(this.path, 'utf8');
}

View.prototype.lookup = function(name){
  // <path>.<engine>
  var path = join(this.root, name);
  if (exists(path)) return path;

  // <path>/index.<engine>
  path = join(dirname(path), basename(name, '.' + this.ext), 'index.' + this.ext);
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
  options.filename = this.path;
  this.engine.render(this.string, options, fn);
};
