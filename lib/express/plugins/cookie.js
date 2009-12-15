
// Express - Cookie - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Parse an HTTP _cookie_ string into a hash.
 *
 * @param  {string} cookie
 * @return {hash}
 * @api public
 */

exports.parseCookie = function(cookie) {
  return $(cookie.replace(/^ *| *$/g, '').split(/ *; */)).reduce({}, function(hash, pair){
    var parts = pair.split(/ *= */)
    hash[parts[0].toLowerCase()] = parts[1]
    return hash
  })
}

/**
 * Convert _hash_ to a cookie string.
 *
 * All dates are converted to 'Wdy, DD-Mon-YYYY HH:MM:SS GMT'
 *
 * @param  {hash} hash
 * @return {string}
 * @api public
 */

exports.compileCookie = function(hash) {
  return $(hash).map(function(val, key){
    if (val instanceof Date)
      val = val.toString()
        .replace(/^(\w+)/, '$1,')
        .replace(/(\w+) (\d+) (\d+)/, '$2-$1-$3')
        .replace(/GMT.*$/, 'GMT')
    return key + '=' + val
  }).toArray().join('; ')
}

/**
 * Get or set cookie values.
 *
 * @param  {string} key
 * @param  {string} val
 * @return {string}
 * @api public
 */

exports.cookie = function(key, val) {
  return val === undefined ?
    Express.server.request.cookie[key] :
      (Express.server.response.cookie = 
       Express.server.response.cookie ||
       {})[key] = val
}

// --- Cookie

exports.Cookie = Plugin.extend({
  init: function() {
    this.__super__.apply(arguments)
    process.mixin(GLOBAL, exports)
  },
  on: {
    request: function(event) {
      if (event.request.headers.cookie)
        event.request.cookie = exports.parseCookie(event.request.headers.cookie)
    },
    
    response: function(event) {
      if (event.response.cookie)
        header('set-cookie', exports.compileCookie(event.response.cookie))
    }
  }
})