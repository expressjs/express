
// Express - Redirect - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Redirect to _uri_.
 *
 * When using redirect(home) the resolution
 * is as follows:
 *
 *  - set('home')
 *  - set('basepath')
 *  - '/'
 *
 * When using redirect(back) the HTTP referrer
 * header is used. Commonly misspelled as 'referer'
 * which is supported as well.
 *
 * @param  {string} uri
 * @settings 'home', 'basepath'
 * @api public
 */

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