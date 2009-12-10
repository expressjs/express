
// Express - MethodOverride - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.MethodOverride = Plugin.extend({
  on: {
    request: function(event) {
      if (param('__method__'))
       event.request.method = param('__method__').toLowerCase()
    }
  }
})