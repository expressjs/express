
// Express - BodyDecoder - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var queryString = require('querystring')

exports.BodyDecoder = Plugin.extend({
  on: {
    
    /**
     * Decodes common content-types, currently handles:
     *
     *  - application/x-www-form-urlencoded
     */
    
    request: function(event) {
      var request = event.request
      if (request.header('content-type') &&
          request.header('content-type').indexOf('application/x-www-form-urlencoded') > -1)
          request.params.post = queryString.parseQuery(request.body)
    }
  }
})