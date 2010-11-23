
/*!
 * Express - View
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path')
  , extname = path.extname
  , dirname = path.dirname
  , basename = path.basename
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
  var path = this.path;
  return cache[path] || (cache[path] = fs.readFileSync(path, 'utf8'));
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

/**
 * Register the given template engine `exports`
 * as `ext`. For example we may wish to map ".html"
 * files to jade:
 *
 *    app.register('.html', require('jade'));
 *
 * This is also useful for libraries that may not
 * match extensions correctly. For example my haml.js
 * library is installed from npm as "hamljs" so instead
 * of layout.hamljs, we can register the engine as ".haml":
 *
 *    app.register('.haml', require('haml-js'));
 *
 * For engines that do not comply with the Express
 * specification, we can also wrap their api this way.
 *
 *    app.register('.foo', {
 *        render: function(str, options) {
 *            // perhaps their api is
 *            // return foo.toHTML(str, options);
 *        }
 *    });
 *
 * @param {String} ext
 * @param {Object} obj
 * @api public
 */

exports.register = function(ext, exports) {
  cache[ext] = exports;
};
