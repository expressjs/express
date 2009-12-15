
// Express - Request - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

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
   * Route parameters.
   */
  
  params: {},
  
  /**
   * Initialize with node's _request_ and _response_ objects.
   *
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
  
  init: function(request, response) {
    process.mixin(true, this, request)
    response.headers = {}
    this.response = response
    this.uri.path = exports.normalizePath(this.uri.path)
    this.uri.params = parseNestedParams(this.uri.params)
    this.plugins = $(Express.plugins).map(function(plugin){
      return new plugin.klass(plugin.options) 
    })
    this.uri.post = 
      this.header('content-type') == 'application/x-www-form-urlencoded' ?
        parseParams(this.body) :
          {}
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
    return val === undefined ?
      this.headers[key.toLowerCase()] :
        this.response.headers[key.toLowerCase()] = val
  },
  
  /**
   * Return a param _key_ value or null.
   *
   *  - Checks route populated parameters
   *  - Checks POST parameters
   *  - Checks GET parameters
   *
   * @param  {string} key
   * @return {string}
   * @api public
   */

  param: function(key) {
    return this.params[key] ||
           this.uri.post[key] ||
           this.uri.params[key]
  },
  
  /**
   * Check if Accept header includes the mime type
   * for the given _path_, which calls mime().
   *
   * @param  {string} path
   * @see mime()
   * @api public
   */

  accepts: function(path) {
    return this.header('accept').indexOf(mime(path)) != -1
  },

  /**
   * Set response status to _code_.
   *
   * @param  {int} code
   * @return {int}
   * @api public
   */

  status: function(code) {
    return this.response.status = code
  },
  
  /**
   * Trigger even _name_ with optional _data_.
   *
   * @param  {string} name
   * @param  {hash} data
   * @api public
   */

  trigger: function(name, data) {
    data = process.mixin(data || {}, {
      request: this,
      response: this.response
    })
    this.plugins.each(function(plugin){
      plugin.trigger(new Event(name, data))
    })
  }
})