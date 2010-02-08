
// Express - Flash - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.Flash = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function(){
      Request.include({
        flash: function(key, val) {
          
        }
      })
    }
  }
})