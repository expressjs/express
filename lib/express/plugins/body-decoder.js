
// Express - BodyDecoder - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var queryString = require('querystring')

// --- BodyDecoder

exports.BodyDecoder = Plugin.extend({
  on: {
    
    /**
     * Decodes common content-types, currently handles:
     *
     *  - application/x-www-form-urlencoded
     */
    
    request: function(event) {
      var request = event.request
      if (request.header('Content-Type') &&
          request.header('Content-Type').includes('application/x-www-form-urlencoded'))
          request.params.post = queryString.parseQuery(request.body)
    }
  }
})