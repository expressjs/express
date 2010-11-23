
/*!
 * Express - View
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var extname = require('path').extname
  , dirname = require('path').dirname
  , basename = require('path').basename
  , fs = require('fs');

/**
 * Memory cache.
 */

var cache = {};

/**
 * Initialize a new `View` with the given `view` path and `options`.
 *
 * @param {String} view
 * @param {Object} options
 * @api private
 */

var View = exports = module.exports = function View(view, options) {
  options = options || {};
  // TODO: memoize basename etc
  this.view = view;
  this.root = options.root;
  this.relative = false !== options.relative;
  this.defaultEngine = options.defaultEngine;
  this.parent = options.parentView;
  this.basename = basename(view);
  this.engine = this.resolveEngine();
  this.extension = '.' + this.engine;
  this.path = this.resolvePath();
  this.dirname = dirname(this.path);
};

/**
 * Resolve view engine.
 *
 * @return {String}
 * @api private
 */

View.prototype.resolveEngine = function(){
  // Explicit
  if (~this.basename.indexOf('.')) return extname(this.basename).substr(1);
  // Inherit from parent
  if (this.parent) return this.parent.engine;
  // Default
  return this.defaultEngine;
};

/**
 * Resolve view path.
 *
 * @return {String}
 * @api private
 */

View.prototype.resolvePath = function(){
  var path = this.view;
  // Implicit engine
  if (!~this.basename.indexOf('.')) path += this.extension;
  // Absolute
  if ('/' == path[0]) return path;
  // Relative to parent
  if (this.relative && this.parent) return this.parent.dirname + '/' + path;
  // Relative to root
  return this.root
    ? this.root + '/' + path
    : path;
};

/**
 * Get view contents. This is a one-time hit, so we
 * can afford to be sync.
 *
 * @return {String}
 * @api public
 */

View.prototype.__defineGetter__('contents', function(){
  return fs.readFileSync(this.path, 'utf8');
});

/**
 * Get template engine api, cache exports to reduce
 * require() calls.
 *
 * @return {Object}
 * @api public
 */

View.prototype.__defineGetter__('templateEngine', function(){
  var ext = this.extension;
  return cache[ext] || (cache[ext] = require(this.engine));
});
