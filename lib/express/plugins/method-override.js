
// Express - MethodOverride - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.MethodOverride = Plugin.extend({
  on: {
    
    /**
     * Set request method to _method param when present.
     */
    
    request: function(event) {
      if (event.request.param('_method'))
       event.request.method = event.request.param('_method').toLowerCase()
    }
  }
})