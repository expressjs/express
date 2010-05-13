
// Express - Redirect - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var Request = require('express/request').Request

// --- Redirect

exports.Redirect = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      Request.include({

        /**
         * Redirect to _url_ with optional status _code_,
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
         * @param  {string} url
         * @settings 'home', 'basepath'
         * @api public
         */

        redirect: function(url, code) {
          if (url === 'back' || url === 'home') url = this[url]
          this.header('Location', url)
          this.respond(code || 303)
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
      event.request.back = event.request.header('Referrer') || event.request.header('Referer')
    }
  }
})