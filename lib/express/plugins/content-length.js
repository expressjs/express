
// Express - ContentLength - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.ContentLength = Plugin.extend({
  on: {
    
    /**
     * Assign Content-Length header unless present.
     */
    
    response: function(event) {
      var response = event.request.response
      response.headers['content-length'] =
        response.headers['content-length'] ||
          response.body.length
    }
  }
})