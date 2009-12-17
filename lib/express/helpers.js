
// Express - Helpers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * JSON aliases.
 */

JSON.encode = JSON.stringify
JSON.decode = JSON.parse

/**
 * Return the directory name of the given _path_.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.dirname = function(path) {
  return path.split('/').slice(0, -1).join('/')
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
 * Decode values in _params_.
 *
 * @param  {hash} params
 * @see parseNestedParams()
 * @api private
 */

function decode(params) {
  for (var key in params)
    params[key] = decodeURIComponent(params[key]).replace(/\+/g, ' ')
}

/**
 * Parse nested _params_.
 *
 * @param  {hash} params
 * @return {hash}
 * @see parseParams() 
 * @api public
 */

exports.parseNestedParams = function(params) {
  var parts, key
  decode(params)
  for (key in params)
    if (parts = key.split('['))
      if (parts.length > 1)
        for (var i = 0, prop = params, len = parts.length; i < len; ++i) {
          var name = parts[i].replace(']', '')
          if (i == len - 1)
            prop[name] = params[key],
            prop = params, 
            delete params[key]
          else
            prop = prop[name] = prop[name] || {}
        }
  return params
}

/**
 * Parse params _string_ into a nested hash.
 *
 * @param  {string} string
 * @return {hash}
 * @api public
 */

exports.parseParams = function(string) {
  return exports.parseNestedParams($(string.split('&')).reduce({}, function(params, pair){
    pair = pair.split('=')
    params[pair[0]] = pair[1]
    return params
  }))
}
