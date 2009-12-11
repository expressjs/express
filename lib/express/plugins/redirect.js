
// Express - Redirect - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.redirect = function(uri) {
  header('location', uri)
  halt(302)
}

exports.Redirect = Plugin.extend({
  init: function() {
    this.__super__.apply(arguments)
    process.mixin(GLOBAL, exports)
  },
  on: {
    request: function(event) {
      home = set('home') ||
             set('basepath') ||
             '/'
      back = header('referrer') ||
             header('referer')
    }
  }
})