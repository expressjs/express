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
  this.lookupView = options.lookupView;
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
  var _this = this;
  this.lookupView(path
    , {ext: this.ext, root: this.root, name: this.name}
    , fn
  );
}

/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

View.prototype.render = function(options, fn) {
  var _this = this;
  
  if(this.path) return this.engine(res, options, fn);
  
  this.lookup(this.fullname, function(err, res) {
    if(err) return fn(err);
    _this.path = res;
    _this.engine(res, options, fn);
  });
};
