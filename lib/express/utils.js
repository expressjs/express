
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
 * Return the extension name of the given _path_,
 * or null when not present.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.extname = function(path) {
  if (path.lastIndexOf('.') < 0) return
  return path.slice(path.lastIndexOf('.') + 1)
}

/**
 * Return the basename of the given _path_.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.basename = function(path) {
  return path.split('/').slice(-1)[0]
}

/**
 * Escape special characters in _html_.
 *
 * @param  {string} html
 * @return {string}
 * @api public
 */

exports.escape = function(html) {
  return html.toString()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Convert native array-like objects into an
 * array with optional _offset_.
 *
 * @param  {object} arr
 * @param  {int} offset
 * @return {array}
 * @api public
 */

exports.toArray = function(arr, offset) {
  return Array.prototype.slice.call(arr, offset)
}

/**
 * Escape RegExp _chars_ in _string_. Where _chars_ 
 * defaults to regular expression special characters.
 *
 * _chars_ should be a space delimited list of characters,
 * for example '[ ] ( )'.
 *
 * @param  {string} string
 * @param  {string} chars
 * @return {Type}
 * @api public
 */

exports.escapeRegexp = function(string, chars) {
  var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
  return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
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
  $(keys).reduce(queryString.parseQuery(key), function(parts, key, i){
    if (i === keys.length - 1)
      if (key in params)
        params[key] instanceof Array ?
          params[key].push(val) :
            params[key] = [params[key], val]
      else
        params[key] = array ? [val] : val
    if (!(key in params)) params[key] = {}
    params = params[key]
    return parts[key]
  })
  return orig
}

/**
 * Return a clone of _obj_.
 *
 * @param  {mixed} obj
 * @return {mixed}
 * @api public
 */

function Clone() {}
exports.clone = function(obj) {
  Clone.prototype = obj
  return new Clone
}