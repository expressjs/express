
// Express - Request - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var StaticFile = require('express/static').File,
    statusBodies = require('http').STATUS_CODES,
    queryString = require('querystring'),
    mime = require('express/mime'),
    utils = require('express/utils'),
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

exports.Request = Class({
  
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
  
  init: function(request, response) {
    utils.mixin(true, this, request)
    response.headers = {}
    this.response = response
    this.url = url.parse(this.url)
    this.url.pathname = exports.normalizePath(this.url.pathname)
    this.params = this.params || {}
    this.params.path =  {}
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
      ? this.headers[key.toLowerCase()]
      : this.response.headers[key.toLowerCase()] = val
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
    return accept 
      ? arguments.any(function(path){
          var type = mime.type(path)
          return accept.indexOf(type) !== -1 ||
            accept.indexOf(type.split('/')[0]+'/*') !== -1
        })
      : true
  },

  /**
   * Set response status to _code_.
   *
   * @param  {int} code
   * @return {Request)
   * @api public
   */

  status: function(code) {
    this.response.status = code
    return this
  },
  
  /**
   * Immediately respond with response _code_, _body_ and optional _encoding_.
   * The status _code_ defaults to to 404, and _body_ will
   * default to the default body associated with the response
   * _code_.
   *
   * @param  {int} code
   * @param  {string} body
   * @param  {string} encoding
   * @see statusBodies
   * @api public
   */

  halt: function(code, body, encoding, callback) {
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
    this.trigger('response', function(e) {
      if (e)
        if (callback !== undefined) callback(e)
        else throw e
      self.response.writeHeader(self.response.status, self.response.headers)
      self.response.write(self.response.body, encoding)
      self.response.close()
    });
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
   * @return {Request}
   * @api public
   */

  trigger: function(name, data, callback) {
    if (data instanceof Function)
      callback = data,
      date = null
    data = data || {}
    data.merge({ request: this, response: this.response })
    var self = this,
        complete = 0,
        total = this.plugins.length
    ;(function next(e) {
      if (e || complete === total)
        callback(e)
      else {
        try {
          if (self.plugins.at(complete++).trigger(new Event(name, data), next) !== true)
            next()
        } catch(e) {
          next(e)
        }
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
   * Transfer static file at the given _path_.
   *
   * @param  {string} path
   * @return {Request}
   * @api public
   */
  
  sendfile: function(path) {
    (new StaticFile(path)).send(this)
    return this
  }
})