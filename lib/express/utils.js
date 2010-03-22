
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
