
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
    hash[parts[0]] = parts[1]
    return hash
  })
}

/**
 * Compile cookie _name_, _val_ and _options_ to a string.
 *
 * Options:
 *
 *  - path:    Cookie path, defaults to '/'
 *  - expires  Date object converted to 'Wdy, DD-Mon-YYYY HH:MM:SS GMT'
 *             when undefined the cookie will last the duration of a the
 *             client's session.
 *
 * @param  {string} name
 * @param  {string} val
 * @param  {hash} options
 * @return {string}
 * @api public
 */

exports.compileCookie = function(name, val, options) {
  if (!options) return name + '=' + val
  return name + '=' + val + '; ' + $(options).map(function(val, key){
    if (val instanceof Date)
      val = val.toString()
        .replace(/^(\w+)/, '$1,')
        .replace(/(\w+) (\d+) (\d+)/, '$2-$1-$3')
        .replace(/GMT.*$/, 'GMT')
    return val === true ? key : key + '=' + val
  }).toArray().join('; ')
}

// --- Request

Request.include({
  
  /**
   * Get or set cookie values.
   *
   * @param  {string} name
   * @param  {string} val
   * @param  {hash} options
   * @return {string}
   * @api public
   */

  cookie: function(name, val, options) {
    if (!val) return this.response.cookie[name]
    this.header('set-cookie', exports.compileCookie(name, val, options))
  }  
})

// --- Cookie

exports.Cookie = Plugin.extend({
  on: {
    request: function(event) {
      event.request.response.cookie = {}
      if (event.request.headers.cookie)
        event.request.response.cookie = exports.parseCookie(event.request.headers.cookie)
    },
  }
})