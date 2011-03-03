
/*!
 * Express - Utils
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path')
  , basename = path.basename
  , dirname = path.dirname
  , extname = path.extname;

/**
 * Memory cache.
 */

var cache = {
    basename: {}
  , dirname: {}
  , extname: {}
};

/**
 * Cached basename.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

exports.basename = function(path){
  return cache.basename[path]
    || (cache.basename[path] = basename(path));
};

/**
 * Cached dirname.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

exports.dirname = function(path){
  return cache.dirname[path]
    || (cache.dirname[path] = dirname(path));
};

/**
 * Cached extname.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

exports.extname = function(path){
  return cache.extname[path]
    || (cache.extname[path] = extname(path));
};

/**
 * Merge object `b` with `a` giving precedence to
 * values in object `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.union = function(a, b){
  if (a && b) {
    var keys = Object.keys(b)
      , len = keys.length
      , key;
    for (var i = 0; i < len; ++i) {
      key = keys[i];
      if (!a.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
  }
  return a;
};

/**
 * Parse mini markdown implementation.
 * The following conversions are supported,
 * primarily for the "flash" middleware:
 *
 *    _foo_ or *foo* become <em>foo</em>
 *    __foo__ or **foo** become <strong>foo</strong>
 *    [A](B) becomes <a href="B">A</a>
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.miniMarkdown = function(str){
  return String(str)
    .replace(/(__|\*\*)(.*?)\1/g, '<strong>$2</strong>')
    .replace(/(_|\*)(.*?)\1/g, '<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
};

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.htmlEscape = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Parse "Range" header `str` relative to the given file `size`.
 *
 * @param {Number} size
 * @param {String} str
 * @return {Array}
 * @api private
 */

exports.parseRange = function(size, str){
  var valid = true;
  var arr = str.substr(6).split(',').map(function(range){
    var range = range.split('-')
      , start = parseInt(range[0], 10)
      , end = parseInt(range[1], 10);

    // -500
    if (isNaN(start)) {
      start = size - end;
      end = size - 1;
    // 500-
    } else if (isNaN(end)) {
      end = size - 1;
    }

    // Invalid
    if (isNaN(start) || isNaN(end) || start > end) valid = false;

    return { start: start, end: end };
  });
  return valid ? arr : undefined;
};
