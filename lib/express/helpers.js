
// Express - Helpers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.jsonEncode = function(object) {
  return JSON.stringify(object)
}

exports.dirname = function(path) {
  return path.split('/').slice(0, -1).join('/')
}

exports.param = function(key) {
  return Express.server.router.params[key]
}

/**
 * Escape special characters in _html_.
 *
 * @param  {string} html
 * @return {string}
 * @api public
 */

exports.escape = function(html) {
  if (html instanceof String)
    return html
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