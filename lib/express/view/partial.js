
/*!
 * Express - view - Partial
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var View = require('./view')
  , basename = require('path').basename
  , stat = require('fs').statSync;

/**
 * Memory cache.
 */

var cache = {};

/**
 * Initialize a new `Partial` for the given `view` and `options`.
 *
 * @param {String} view
 * @param {Object} options
 * @api private
 */

var Partial = exports = module.exports = function Partial(view, options) {
  options = options || {};
  View.call(this, view, options);
  this.path = this.resolvePartialPath(this.dirname);
};

/**
 * Inherit from `View.prototype`.
 */

Partial.prototype.__proto__ = View.prototype;

/**
 * Resolve partial view path.
 *
 * @param {String} dir
 * @return {String}
 * @api public
 */

Partial.prototype.resolvePartialPath = function(dir){
  return dir + '/_' + basename(this.path);
};

/**
 * Resolve partial object name from the view path.
 *
 * Examples:
 *
 *   "user.ejs" becomes "user"
 *   "forum thread.ejs" becomes "forumThread"
 *   "forum/thread/post.ejs" becomes "post"
 *   "blog-post.ejs" becomes "blogPost"
 *
 * @return {String}
 * @api private
 */

exports.resolveObjectName = function(view){
  return cache[view] || (cache[view] = view
    .split('/')
    .slice(-1)[0]
    .split('.')[0]
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .split(/ +/).map(function(word, i){
      return i
        ? word[0].toUpperCase() + word.substr(1)
        : word;
    }).join(''));
};