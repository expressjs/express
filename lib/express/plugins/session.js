
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- Session

var Session = Class({
  
  /**
   * Initialize session _sid_.
   */
  
  init: function(sid) {
    this.id = sid
    this.touch()
  },
  
  /**
   * Update last access time.
   *
   * @api private
   */
  
  touch: function() {
    this.lastAccess = Number(new Date)
  }
})

// --- MemoryStore

exports.MemoryStore = Class({
  
  /**
   * Initialize in-memory session store.
   */
  
  init: function() {
    this.store = {}
  },
  
  /**
   * Fetch session with the given _sid_ or 
   * a new Session is returned.
   *
   * @param  {int} sid
   * @return {Session}
   * @api private
   */
  
  fetch: function(sid) {
    return this.store[sid] || new Session(sid)
  },
  
  /**
   * Commit _session_ data.
   *
   * @param  {Session} session
   * @api private
   */
  
  commit: function(session) {
    return this.store[session.id] = session
  },
  
  /**
   * Clear all sessions.
   *
   * @api public
   */
  
  clear: function() {
    this.store = {}
  },
  
  /**
   * Destroy session using the given _sid_.
   *
   * @param  {int} sid
   * @api public
   */
  
  destroy: function(sid) {
    delete this.store[sid]
  },
  
  /**
   * Reap sessions older than _ms_.
   *
   * @param  {int} ms
   * @api private
   */
  
  reap: function(ms) {
    var threshold = Number(new Date(Number(new Date) - ms))
    for (var sid in this.store)
      if (this.store.hasOwnProperty(sid))
        if (this.store[sid].lastAccess < threshold)
          this.destroy(sid)
  }
})

exports.Session = Plugin.extend({
  extend: {
    
    /**
     * Initialize memory store and start reaper.
     *
     * Options:
     *
     *  - lifetime      lifetime of session in milliseconds, defaults to one day
     *  - reapInterval  interval in milliseconds in which to reap old sessions, defaults to one hour
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      process.mixin(this, options)
      this.store = new (this.store || exports.MemoryStore)(options)
      this.startReaper()
    },
    
    /**
     * Start reaper.
     *
     * @api private
     */
    
    startReaper: function() {
      var self = this,
          oneDay = 86400000,
          oneHour = 3600000
      setInterval(function(){
        self.store.reap(self.lifetime || oneDay)
      }, self.reapInterval || oneHour)
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Create session id when not found; delegate to store.
     */
    
    request: function(event) {
      var sid
      if (!(sid = event.request.cookie('sid')))
        event.request.cookie('sid', sid = uid(), set('session cookie'))
      event.request.session = exports.Session.store.fetch(sid)
      event.request.session.touch()
    },
    
    /**
     * Delegate to store, allowing it to save sessions changes.
     */
    
    response: function(event) {
      exports.Session.store.commit(event.request.session)
    }
  }
})