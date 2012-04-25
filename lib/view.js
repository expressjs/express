/*!
 * Express - View
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('./utils')
  , extname = require('path').extname;

/**
 * Expose `View`.
 */

module.exports = View;


/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `lookup` the lookup function 
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
  this._lookup = options.lookup;
  var ext = this.ext = extname(name);
  if (!ext) name += (ext = this.ext = '.' + this.defaultEngine);
  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
  this.fullname = name;
}

/**
 * Lookup view by the given `path`
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

View.prototype.lookup = function(path, fn) {
  this._lookup(path, this, fn);
};

/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

View.prototype.render = function(options, fn) {
  var self = this;
  
  if (this.path) return this.engine(this.path, options, fn);
  
  this.lookup(this.fullname, function(err, path){
    if (err) return fn(err);
    self.path = path;
    self.engine(path, options, fn);
  });
};
