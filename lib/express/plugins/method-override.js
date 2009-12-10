
// Express - MethodOverride - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.MethodOverride = Plugin.extend({
  on: {
    request: function(event) {
      //if (params('__method__'))
      //  event.request.
    }
  }
})