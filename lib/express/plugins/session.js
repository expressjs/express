
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var Request = require('express/request').Request,
    utils = require('express/utils')

// --- Session

exports.Base = new Class({
  
  /**
   * Initialize session _sid_.
   */
  
  constructor: function(sid) {
    this.id = sid
    this.touch()
  },
  
  /**
   * Update last access time.
   *
   * @api private
   */
  
  touch: function() {
    this.lastAccess = Date.now()
  }
})

// --- Store

exports.Store = new Class({
  
  /**
   * Convert to '[NAME Store]'.
   *
   * @return {string}
   * @api public
   */
  
  toString: function() {
    return '[' + this.name + ' Store]'
  }
})

// --- Store.Memory

exports.Store.Memory = exports.Store.extend({
  
  /**
   * Datastore name.
   */
  
  name: 'Memory',
  
  /**
   * Initialize in-memory session store.
   */
  
  constructor: function() {
    this.store = {}
  },
  
  /**
   * Fetch session with the given _sid_ or 
   * a new Session is created.
   *
   * @param  {number} sid
   * @param  {function} callback
   * @api private
   */
  
  fetch: function(sid, callback) {
    if (sid && this.store[sid])
      callback(null, this.store[sid])
    else
      this.generate(callback)
  },
  
  /**
   * Commit _session_ data.
   *
   * @param  {Session} session
   * @param  {function} callback
   * @api private
   */
  
  commit: function(session, callback) {
    this.store[session.id] = session 
    if (callback) callback(null, session)
  },
  
  /**
   * Clear all sessions.
   *
   * @param  {function} callback
   * @api public
   */
  
  clear: function(callback) {
    this.store = {}
    if (callback) callback()
  },
  
  /**
   * Destroy session using the given _sid_.
   *
   * @param  {int} sid
   * @param  {function} callback
   * @api public
   */
  
  destroy: function(sid, callback) {
    delete this.store[sid]
    if (callback) callback(sid)
  },
  
  /**
   * Pass the number of sessions currently stored.
   *
   * @param  {function} callback
   * @api public
   */
  
  length: function(callback) {
    callback(null, Object.keys(this.store).length)
  },
  
  /**
   * Reap sessions older than _ms_.
   *
   * @param  {int} ms
   * @api private
   */
  
  reap: function(ms) {
    var threshold = +new Date(Date.now() - ms),
        sids = Object.keys(this.store)
    for (var i = 0, len = sids.length; i < len; ++i)
      if (this.store[sids[i]].lastAccess < threshold)
        this.destroy(sids[i])
  },

  /**
   * Creates and passes a shiny new session.
   *
   * @param {function} callback
   * @api public
   */
   
  generate: function(callback) {
    callback(null, new exports.Base(utils.uid()))
  }
})

// --- Session

exports.Session = Plugin.extend({
  extend: {
    
    /**
     * Initialize memory store and start reaper.
     *
     * Options:
     *
     *  - dataStore                constructor name of session data store, defaults to Store.Memory
     *  - lifetime                 lifetime of session in milliseconds, defaults to one day
     *  - reapInterval, reapEvery  interval in milliseconds in which to reap old sessions, defaults to one hour
     *  - cookie                   session specific cookie options passed to Request#cookie()
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      this.cookie = {}
      Object.merge(this, options)
      this.cookie.httpOnly = true
      this.store = new (this.dataStore || exports.Store.Memory)(options)
      this.startReaper()
    },
    
    /**
     * Start reaper.
     *
     * @api private
     */
    
    startReaper: function() {
      setInterval(function(self) {
        self.store.reap(self.lifetime || (1).day) 
      }, this.reapInterval || this.reapEvery || (1).hour, this)
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Create session id when not found; delegate to store.
     */
    
    request: function(event, callback) {
      var sid = event.request.cookie('sid')
      if (!sid && event.request.url.pathname === '/favicon.ico') return
      exports.Session.store.fetch(sid, function(err, session) {
        if (err) return callback(err)
        if (session.id != sid) 
          event.request.cookie('sid', session.id, exports.Session.cookie)
        event.request.session = session
        event.request.session.touch()
        callback()
      })
      return true
    },
    
    /**
     * Delegate to store, allowing it to save sessions changes.
     */
    
    response: function(event, callback) {
      if (event.request.session)
        return exports.Session.store.commit(event.request.session, callback),
               true
    }
  }
})