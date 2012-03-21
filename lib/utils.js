
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
 * Return best match from `types` based on the given `str` Accept header
 * value. All else being equal, types with lower indexes are favored.
 *
 * `types` should be given in order of server preference.
 *
 * @param {Array} or {String} types
 * @param {String} str
 * @return {String}
 * @api public
 */

exports.accepts = function(types, str) {
  if (typeof(types) == 'string') {
    types = [types]
  }

  // accept first when Accept is not present
  if (!str) return ((!~types[0].indexOf('/')) ? mime.lookup(types[0]) : types[0])

  var accepted = exports.parseAccept(str)
    , obj
    , type
    , ok
    , quality
    , group

  while (accepted.length > 0) {

    quality = accepted[0].quality
    group = []

    while (accepted.length > 0 && accepted[0].quality == quality) {
      group.push(accepted.shift())
    }

    for (var i = 0; i < types.length; ++i) {

      type = types[i]
      if (!~type.indexOf('/')) type = mime.lookup(type)
      type = type.split('/')

      for (var j = 0; j < group.length; ++j) {
        obj = group[j];
        ok = (type[0] == obj.type || '*' == obj.type)
          && (type[1] == obj.subtype || '*' == obj.subtype);
        if (ok) return type.join('/');
      }
    }
  }

  return false
}

/**
 * Parse accept `str`, returning
 * an array objects containing
 * `.type` and `.subtype` along
 * with the values provided by
 * `parseQuality()`.
 *
 * @param {Type} name
 * @return {Type}
 * @api public
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
 * @api public
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
