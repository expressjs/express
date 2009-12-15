
// Express - ContentLength - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.ContentLength = Plugin.extend({
  on: {
    response: function(event) {
      var response = event.request.response
      response.headers['content-length'] =
        response.headers['content-length'] ||
          response.body.length
    }
  }
})