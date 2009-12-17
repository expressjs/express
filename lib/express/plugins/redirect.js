
// Express - Redirect - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.Redirect = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      Request.include({

        /**
         * Redirect to _uri_ with optional status _code_,
         * defaulting to 303 "See Other".
         *
         * When using redirect('home') the resolution
         * is as follows:
         *
         *  - set('home')
         *  - set('basepath')
         *  - '/'
         *
         * When using redirect('back') the HTTP referrer
         * header is used. Commonly misspelled as 'referer'
         * which is supported as well.
         *
         * @param  {string} uri
         * @settings 'home', 'basepath'
         * @api public
         */

        redirect: function(uri, code) {
          if (uri == 'back' || uri == 'home') uri = this[uri]
          this.header('location', uri)
          this.halt(code || 303)
        }  
      })
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Assign home to 'home', 'basepath' or '/'.
     * Assign back to 'referrer' or 'referer' headers.
     */
    
    request: function(event) {
      event.request.home = set('home') || set('basepath') || '/'
      event.request.back = event.request.header('referrer') || event.request.header('referer')
    }
  }
})