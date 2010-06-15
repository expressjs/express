
// Express - Cookie - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var Request = require('./../request').Request,
    queryString = require('querystring')

/**
 * Parse an HTTP _cookie_ string into a hash.
 *
 * @param  {string} cookie
 * @return {hash}
 * @api public
 */

exports.parseCookie = function(cookie) {
  return cookie.split(/[;,] */).reduce(function(cookies, pair) {
    var eql = pair.indexOf('=')
    if (eql === -1) return cookies
    var key = queryString.unescape(pair.slice(0, eql).trim(), true)
    var val = queryString.unescape(pair.slice(eql + 1).trim(), true)
    var captures = val.match(/^("|')([^\1]*)\1$/)
    if (captures) val = captures[2].replace('\\' + captures[1], captures[1])
    //RFC2109 states the most specific path will be
    //listed first
    if (cookies[key] === undefined)
      cookies[key] = val
    return cookies
  }, {})
}

/**
 * Compile cookie _name_, _val_ and _options_ to a string.
 *
 * @param  {string} name
 * @param  {string} val
 * @param  {hash} options
 * @return {string}
 * @api public
 */

exports.compileCookie = function(name, val, options) {
  if (!options) return name + '=' + val
  var val,
      buf = [queryString.escape(name) + '=' + queryString.escape(val)],
      keys = Object.keys(options)
  for (var i = 0, len = keys.length; i < len; ++i) {
    val = options[keys[i]]
    if (val instanceof Date)
      val = val.toGMTString()
    buf.push(val === true 
      ? keys[i]
      : keys[i] + '=' + val)
  }
  return buf.join('; ')
}

// --- Cookie

exports.Cookie = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      Request.include({

        /**
         * Get or set cookie values. To delete a cookie
         * simply pass a null _val_.
         *
         * Options:
         *
         *  - path       Cookie path, defaults to '/'
         *  - domain     Tail matched domain name such as 'vision-media.ca' or 'blog.vision-media.ca' etc
         *  - expires    Date object converted to 'Wdy, DD-Mon-YYYY HH:MM:SS GMT'
         *               when undefined the cookie will last the duration of a the
         *               client's session.
         *  - secure     When true the cookie will be sent by the client only when transfering data via HTTPS
         *  - httpOnly   When true the cookie will be sent to the server only and will not be accessable via
         *               client-side scripting.
         *
         * @param  {string} name
         * @param  {string} val
         * @param  {hash} options
         * @return {string}
         * @api public
         */

        cookie: function(name, val, options) {
          options = options || {}
          options.path = options.path || '/'
          if (null === val)
            val = "delete",
            options.expires = new Date(10000000)
          return val
            ? this.response.cookies.push(exports.compileCookie(name, val, options))
            : this.cookies[name]
        }
      })
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Parse request cookie data.
     */
    
    request: function(event) {
      event.request.response.cookies = []
      event.request.cookies = event.request.headers.cookie
        ? exports.parseCookie(event.request.headers.cookie)
        : {}
    },
    
    /**
     * Set the Set-Cookie header when response cookies are available.
     */
    
    response: function(event) {
      if (event.response.cookies && 
          event.response.cookies.length)
        event.request.header('Set-Cookie', event.response.cookies.join('\r\nSet-Cookie: '))
    }
  }
})
