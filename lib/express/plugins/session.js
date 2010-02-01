
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.Session = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Parser request cookie data.
     */
    
    request: function(event) {
    },
    
    /**
     * Set the Set-Cookie header when response cookies are available.
     */
    
    response: function(event) {
    }
  }
})