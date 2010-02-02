
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.MemoryStore = Class({
  init: function() {
    this.store = {}
  },
  
  fetch: function(sid) {
    return this.store[sid] || {}
  },
  
  commit: function(sid, hash) {
    return this.store[sid] = hash
  },
  
  clear: function() {
    this.store = {}
  }
})

exports.Session = Plugin.extend({
  extend: {
    
    /**
     * Initialize memory store.
     */
    
    init: function() {
      this.store = new (set('session store') || exports.MemoryStore)
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Create session id when not found; delegate to store.
     */
    
    request: function(event) {
      var request = event.request
      if (!(request.sid = request.cookie('sid'))) {
        var inOneDay = new Date(Number(new Date) + 86400),
            options = set('session') || { expires: inOneDay }
        request.cookie('sid', request.sid = uid(), options)
      }
      request.session = exports.Session.store.fetch(request.sid) 
    },
    
    /**
     * Delegate to store, allowing it to save sessions changes.
     */
    
    response: function(event) {
      if (event.request.sid)
        exports.Session.store.commit(event.request.sid, event.request.session)
    }
  }
})