
// Express - ContentLength - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.ContentLength = Plugin.extend({
  on: {
    
    /**
     * Assign Content-Length header unless present.
     */
    
    response: function(event) {
      var response = event.request.response
      if (!response.chunkedEncoding)
        if (!response.headers['Content-Length'] && response.body)
          response.headers['Content-Length'] = response.body.length
    }
  }
})