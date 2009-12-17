
// Express - MethodOverride - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.MethodOverride = Plugin.extend({
  on: {
    
    /**
     * Set request method to __method__ param when present.
     */
    
    request: function(event) {
      if (event.request.param('__method__'))
       event.request.method = event.request.param('__method__').toLowerCase()
    }
  }
})