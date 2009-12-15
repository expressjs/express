
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

// --- Request

Request.include({
  
  /**
   * Get or set cookie values.
   *
   * @param  {string} key
   * @param  {string} val
   * @return {string}
   * @api public
   */

  cookie: function(key, val) {
    if (!this.response.cookie) this.response.cookie[key] = {}
    return val === undefined ?
      this.response.cookie[key] :
        this.response.cookie[key] = val
  }  
})

// --- Cookie

exports.Cookie = Plugin.extend({
  on: {
    request: function(event) {
      if (event.request.headers.cookie)
        event.request.response.cookie = exports.parseCookie(event.request.headers.cookie)
    },
    
    response: function(event) {
      if (event.request.response.cookie)
        event.request.header('set-cookie', exports.compileCookie(event.request.response.cookie))
    }
  }
})