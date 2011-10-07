
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
  , extname = path.extname
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
  var engines = options.engines;
  this.defaultEngine = options.defaultEngine;
  this.extname = extname(name);
  if (!this.extname) name += '.' + (this.extname = this.defaultEngine);
  this.engine = engines[this.extname] || (engines[this.extname] = require(this.extname));
  this.path = join(options.root, name);
  this.string = fs.readFileSync(this.path, 'utf8');
}

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
