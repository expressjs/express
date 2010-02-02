
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var Session = Class({
  init: function(sid) {
    this.id = sid
    this.touch()
  },
  
  touch: function() {
    this.lastAccess = Number(new Date)
    require('sys').p('touched ' + this.id)
  }
})

exports.MemoryStore = Class({
  init: function() {
    this.store = {}
  },
  
  fetch: function(sid) {
    return this.store[sid] || new Session(sid)
  },
  
  commit: function(session) {
    return this.store[session.id] = session
  },
  
  clear: function() {
    this.store = {}
  },
  
  destroy: function(sid) {
    require('sys').p('destroying ' + sid)
    require('sys').p(this.store[sid])
    delete this.store[sid]
  },
  
  reap: function(ms) {
    var threshold = Number(new Date(Number(new Date) - ms))
    require('sys').p('reaping less than ' + threshold + ' ms')
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
     */
    
    init: function(options) {
      process.mixin(this, options)
      this.store = new (this.store || exports.MemoryStore)(options)
      this.startReaper()
    },
    
    /**
     * Start reaping
     *
     * @param  {Type} Var
     * @return {Type}
     * @api public
     */
    
    startReaper: function() {
      var self = this,
          oneDay = 86400000,
          oneHour = 3600000
      setInterval(function(){
        require('sys').p('reaping')
        self.store.reap(self.expires || self.maxAge || oneDay)
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