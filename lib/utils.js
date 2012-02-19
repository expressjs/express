
/*!
 * Express - utils
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var mime = require('mime');

/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

exports.isAbsolute = function(path){
  if ('/' == path[0]) return true;
  if (':' == path[1] && '\\' == path[2]) return true;
};

/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

exports.flatten = function(arr, ret){
  var ret = ret || []
    , len = arr.length;
  for (var i = 0; i < len; ++i) {
    if (Array.isArray(arr[i])) {
      exports.flatten(arr[i], ret);
    } else {
      ret.push(arr[i]);
    }
  }
  return ret;
};

/**
 * Check if `type` is acceptable based on
 * the given `str`.
 *
 * @param {String} type
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

exports.accepts = function(type, str){
  // accept anything when Accept is not present
  if (!str) return true;

  // resolve mime
  if (!~type.indexOf('/')) type = mime.lookup(type);

  // split type/subtype
  type = type.split('/');

  // parse
  var accepted = exports.parseAccept(str)
    , len = accepted.length
    , obj
    , ok;

  for (var i = 0; i < len; ++i) {
    obj = accepted[i];
    if (exports.accept(type, obj)) return true;
  }

  return false;
};

/**
 * Check if `type` array is acceptable for `other`.
 *
 * @param {Array} type
 * @param {Object} other
 * @return {Boolean}
 * @api private
 */

exports.accept = function(type, other){
  return (type[0] == other.type || '*' == other.type)
    && (type[1] == other.subtype || '*' == other.subtype);
};

/**
 * Parse accept `str`, returning
 * an array objects containing
 * `.type` and `.subtype` along
 * with the values provided by
 * `parseQuality()`.
 *
 * @param {Type} name
 * @return {Type}
 * @api private
 */

exports.parseAccept = function(str){
  return exports
    .parseQuality(str)
    .map(function(obj){
      var parts = obj.value.split('/');
      obj.type = parts[0];
      obj.subtype = parts[1];
      return obj;
    });
};

/**
 * Parse quality `str`, returning an
 * array of objects with `.value` and
 * `.quality`.
 *
 * @param {Type} name
 * @return {Type}
 * @api private
 */

exports.parseQuality = function(str){
  return str
    .split(/ *, */)
    .map(quality)
    .filter(function(obj){
      return obj.quality;
    })
    .sort(function(a, b){
      return b.quality - a.quality;
    });
};

/**
 * Parse quality `str` returning an
 * object with `.value` and `.quality`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function quality(str) {
  var parts = str.split(/ *; */)
    , val = parts[0];

  var q = parts[1]
    ? parseFloat(parts[1].split(/ *= */)[1])
    : 1;

  return { value: val, quality: q };
}

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
