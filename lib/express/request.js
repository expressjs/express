
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
   * Initialize with node's _request_ and _response_ objects.
   *
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
  
  init: function(request, response) {
    response.headers = {}, request.params = {}
    request.uri.path = exports.normalizePath(request.uri.path)
    request.uri.params = parseNestedParams(request.uri.params)
    request.uri.post = 
      header('content-type') == 'application/x-www-form-urlencoded' ?
        parseParams(request.body) :
          {}
    this.request = request, this.response = response
    this.plugins = $(Express.plugins).map(function(plugin){
      return new plugin.klass(plugin.options) 
    })
  }
})