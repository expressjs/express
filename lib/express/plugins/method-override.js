
// Express - MethodOverride - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.MethodOverride = Plugin.extend({
  on: {
    request: function(event) {
      if (event.request.param('__method__'))
       event.request.method = param('__method__').toLowerCase()
    }
  }
})