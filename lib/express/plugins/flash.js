
// Express - Flash - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var Request = require('express/request').Request

// --- Flash

exports.Flash = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function(){
      Request.include({
        
        /**
         * Get / set flash _key_ and _val_.
         *
         * When a flash _key_ and _val_ are present,
         * it will persist in the session until outputted.
         * The _val_ pushed is returned.
         *
         * When no arguments are given, all flashes are
         * returned keyed by their type.
         *
         * Example:
         *
         *   this.flash('info', 'email sent')
         *   this.flash('info', 'email received')
         *   this.flash('info')
         *   // => ['email sent', 'email received']
         *   
         *   this.flash('info')
         *   // => null
         *
         * @param  {string} key
         * @param  {string} val
         * @return {mixed}
         * @api public
         */
        
        flash: function(key, val) {
          if (!this.session.flash) this.session.flash = {}
          if (!key) {
            var flashes = this.session.flash
            this.session.flash = {}
            return flashes
          }
          if (!(key in this.session.flash)) this.session.flash[key] = []
          if (val) 
            return this.session.flash[key].push(val), val
          else if (key) {
            var vals = this.session.flash[key]
            delete this.session.flash[key]
            if (vals.length) return vals
          }
        }
      })
    }
  }
})