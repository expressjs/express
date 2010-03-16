
// Express - Helpers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var queryString = require('querystring')

/**
 * JSON aliases.
 */

JSON.encode = JSON.stringify
JSON.decode = JSON.parse

/**
 * Return a unique identifier.
 *
 * @return {string}
 * @api public
 */

exports.uid = function() {
  var uid = ''
  for (var n = 4; n; --n)
    uid += (Math.abs((Math.random() * 0xFFFFFFF) | 0)).toString(16)
  return uid
}

/**
 * Escape special characters in _html_.
 *
 * @param  {string} html
 * @return {string}
 * @api public
 */

exports.escape = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Merge param _key_ and _val_ into _params_. Key
 * should be a query string key such as 'user[name]',
 * and _val_ is it's associated object. The root _params_
 * object is returned.
 *
 * @param  {string} key
 * @param  {mixed} val
 * @return {hash}
 * @api public
 */

exports.mergeParam = function(key, val, params) {
  var orig = params,
      keys = key.trim().match(/\w+/g),
      array = /\[\]$/.test(key)
  keys.reduce(function(parts, key, i){
    if (i === keys.length - 1)
      if (key in params)
        params[key] instanceof Array
          ? params[key].push(val)
          : params[key] = [params[key], val]
      else
        params[key] = array ? [val] : val
    if (!(key in params)) params[key] = {}
    params = params[key]
    return parts[key]
  }, queryString.parseQuery(key))
  return orig
}

// From jQuery.extend in the jQuery JavaScript Library v1.3.2
// Copyright (c) 2009 John Resig
// Dual licensed under the MIT and GPL licenses.
// http://docs.jquery.com/License
// Modified for node.js (formely for copying properties correctly)
exports.mixin = function() {
  // copy reference to target object
  var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, source;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !(typeof target === 'function') )
    target = {};

  // mixin process itself if only one argument is passed
  if ( length == i ) {
    target = GLOBAL;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (source = arguments[i]) != null ) {
      // Extend the base object
      Object.getOwnPropertyNames(source).forEach(function(k){
        var d = Object.getOwnPropertyDescriptor(source, k) || {value: source[k]};
        if (d.get) {
          target.__defineGetter__(k, d.get);
          if (d.set) {
            target.__defineSetter__(k, d.set);
          }
        }
        else {
          // Prevent never-ending loop
          if (target !== d.value) {

              if (deep && d.value && typeof d.value === "object") {
                target[k] = exports.mixin(deep,
                  // Never move original objects, clone them
                  target[k] || (d.value.length != null ? [] : {})
                , d.value);
              }
              else {
                target[k] = d.value;
              }
          }
        }
      });
    }
  }
  // Return the modified object
  return target;
};