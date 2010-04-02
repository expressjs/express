
// Express - Request - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var Event = require('express/event').Event,
    showExceptions = require('express/pages/show-exceptions'),
    notFound = require('express/pages/not-found'),
    statusBodies = require('http').STATUS_CODES,
    queryString = require('querystring'),
    mime = require('express/mime'),
    url = require('url')

// --- Helpers

/**
 * Normalize the given _path_.
 * Strips trailing slashes and whitespace.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.normalizePath = function(path) {
  return path.replace(/[\s\/]*$/g, '')
}

// --- Request

exports.Request = new Class({
  
  /**
   * Initialize with node's _request_ and _response_ objects.
   *
   *  - Defaults headers to {}
   *  - Parses request url
   *  - Normalizes url pathname
   *  - Parses GET params when available
   *  - Initializes plugins
   *
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
   
  constructor: function(request, response) {
    this.merge(request)
    response.headers = {}
    this.response = response   
    this.url = url.parse(this.url)
    this.url.pathname = exports.normalizePath(this.url.pathname)  
    this.params = {}
    this.params.path = {}
    this.params.get = this.url.query ? queryString.parseQuery(this.url.query) : {}
    this.params.post = this.params.post || {}
    this.plugins = Express.plugins.map(function(plugin){
      return new plugin.klass(plugin.options) 
    })
  },
  
  /**
   * Set response header _key_ and _val_ or get
   * request header value by _key_.
   *
   * @param  {string} key
   * @param  {string} val
   * @return {string}
   * @api public
   */

  header: function(key, val) {
    return val === undefined
      ? this.headers[key.lowercase]
      : this.response.headers[key.lowercase] = val
  },
  
  /**
   * Return a param _key_ value or null.
   *
   *  - Checks route populated path parameters
   *  - Checks POST parameters
   *  - Checks GET parameters
   *
   * @param  {string} key
   * @return {string}
   * @api public
   */

  param: function(key) {
    return this.params.get[key] ||
           this.params.post[key] ||
           this.params.path[key]
  },
  
  /**
   * Check if Accept header includes the mime type
   * for any of the given paths, which calls mime.type().
   *
   * When no Accept header is present true will be
   * returned as stated in the HTTP specification.
   *
   * Example:
   *
   *   this.accepts('png')
   *   this.accepts('png', 'jpg', 'gif')
   *   this.accepts('image.png')
   *   this.accepts('path/to/image.png')
   *
   * @param  {mixed} ...
   * @return {bool}
   * @api public
   */

  accepts: function() {
    var accept = this.header('accept')
    if (!accept) return true
    return arguments.any(function(path){
      var type = mime.type(path)
        return accept.indexOf(type) !== -1 ||
               accept.indexOf(type.split('/')[0] + '/*') !== -1
    })
  },
  
  /**
   * Check if the request was an xmlHttpRequest (ajax).
   *
   * @return {bool}
   * @api public
   */

  get isXHR() {
    return (this.header('x-requested-with') || '').lowercase === 'xmlhttprequest'
  },

  /**
   * Set response status to _code_.
   *
   * @param  {int} code
   * @return {Request}
   * @api public
   */

  status: function(code) {
    this.response.status = code
    return this
  },
  
  /**
   * Immediately respond with response _code_, _body_.
   *
   * The status _code_ defaults to to 404, and _body_ will
   * default to the default body associated with the response
   * _code_.
   *
   * Optionally an _encoding_ may be passed, followed by
   * a _callback_ function.
   *
   * @param  {int} code
   * @param  {string} body
   * @param  {string} encoding
   * @param  {function} callback
   * @see statusBodies
   * @api public
   */

  halt: function(code, body, encoding, callback) {
    if (encoding instanceof Function)
      callback = encoding,
      encoding = null
    this.status(code = code || 404)
    if (body = body || statusBodies[code])
      return this.respond(body, encoding, callback)
  },
  
  /**
   * Respond with _body_ and optional _encoding_.
   *
   * @param  {string} body
   * @param  {string} encoding
   * @see Request#halt()
   * @api private
   */
  
  respond: function(body, encoding, callback) {
    var self = this
    this.response.body = body
    this.trigger('response', function(err) {
      if (err)
        if (callback !== undefined) callback(err)
        else self.error(err)
      self.response.writeHeader(self.response.status, self.response.headers)
      self.response.write(self.response.body, encoding)
      self.response.close()
    }, true)
  },
  
  /**
   * Pass control to the next matching route, or
   * the given _path_.
   *
   * NOTE: _path_ may be the request pathname only,
   * and may not contain a query string etc.
   *
   * @param {string} path
   * @api public
   */
  
  pass: function(path) {
    this.passed = path || true
    return this
  },
  
  /**
   * Set Content-Type header to the mime type
   * for the given _path_, which calls mime.type().
   *
   * @param  {string} path
   * @return {Request}
   * @api public
   */

  contentType: function(path) {
    this.header('content-type', mime.type(path))
    return this
  },
  
  /**
   * Trigger event _name_ with optional _data_ and _callback_ function.
   * The _callback_ function may be the second or third argument.
   *
   * @param  {string} name
   * @param  {object} data
   * @param  {function} callback
   * @param  {bool} reverse
   * @return {Request}
   * @api public
   */

  trigger: function(name, data, callback, reverse) { 
    if (data instanceof Function)
      reverse = callback,
      callback = data,
      data = null
    data = data || {}
    data.merge({ request: this, response: this.response })
    var self = this,
        complete = 0,
        total = this.plugins.length,
        plugins = reverse
          ? self.plugins.reverse()
          : self.plugins
    ;(function next(err) {
      if (err || complete === total)
        callback(err)
      else {
        if (plugins.at(complete++).trigger(new Event(name, data), next) !== true)
          next()
      }
    })()
    return this
  },
  
  /**
   * Transfer static file at the given _path_ as an attachment.
   * The basename of _path_ is used as the attachment filename.
   *
   * @param  {string} path
   * @return {Request}
   * @api public
   */
  
  download: function(path) {
    return this.attachment(basename(path)).sendfile(path)
  },
  
  /**
   * Set Content-Disposition header to 'attachment',
   * with optional file _path_.
   *
   * @param  {string} path
   * @return {Request}
   * @api public
   */
  
  attachment: function(path) {
    this.header('content-disposition', path
      ? 'attachment; filename="' + path + '"'
      : 'attachment')
    return this
  },
  
  /**
   * Handle exceptions.
   *
   * When an error route is defined via the DSL it
   * will then be called regardless of any setting that
   * may be present. ("throw exceptions" will still work)
   *
   *   error(function(err){
   *     this.halt(500, 'your app sucks!')
   *   })
   *
   * When "html" is accepted, and "show exceptions" is enabled
   * the show-exceptions page will be shown. Otherwise
   * the request will halt with default 500 status body.
   *
   * When "throw exceptions" is enabled the error will be
   * re-thrown, terminating the process (unless otherwise caught).
   *
   * @param  {Error} err
   * @return {Request}
   * @settings 'throw exceptions', 'show exceptions'
   * @api public
   */
  
  error: function(err) {
    if (Express.error)
      Express.error.call(this, err)
    else if (this.accepts('html') && set('show exceptions'))
      this.halt(500, showExceptions.render(this, err))
    else
      this.halt(500)
    if (set('throw exceptions'))
      throw err
    return this
  },
  
  /**
   * Halt with 404 Not Found.
   *
   * When a notFound route is defined via the DSL it
   * will then be called regardless of any settings that
   * may be present.
   *
   *   notFound(function(){
   *     this.halt(404, 'Sorry your page cannot be found')
   *   })
   *
   * When "html" is accepted, and "helpful 404" is enabled
   * the not-found page will be shown, otherwise  the 
   * request will halt with default 404 status body.
   *
   * @return {Request}
   * @api public
   */
  
  notFound: function() {
    if (Express.notFound)
      Express.notFound.call(this)
    else if (this.accepts('html') && set('helpful 404'))
      this.halt(404, notFound.render(this))
    else
      this.halt()
    return this
  }
})