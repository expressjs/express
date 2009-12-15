
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
 * Get cookie _key_'s value or null.
 *
 * @param  {string} key
 * @return {string}
 * @api public
 */

exports.cookie = function(key) {
  return Express.server.request.cookie[key]
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
    }
  }
})