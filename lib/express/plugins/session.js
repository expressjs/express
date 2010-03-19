
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var utils = require('express/utils')

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
    this.lastAccess = Number(new Date)
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
    callback(null, this.store.values.length)
  },
  
  /**
   * Reap sessions older than _ms_.
   *
   * @param  {int} ms
   * @param  {function} callback
   * @api private
   */
  
  reap: function(ms, callback) {
    var threshold = Number(new Date(Number(new Date) - ms))
    this.store.each(function(session, sid){
      if (session.lastAccess < threshold)
        this.destroy(sid)
    }, this)
    if (callback) callback()
  },

  /**
   * Creates and passes a shiny new session.
   *
   * @param {function} callback
   * @api public
   */
   
  generate: function(callback) {
    callback(null,  new exports.Base(utils.uid()))
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
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      this.merge(options || {})
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
    
    request: function(event, next) {
      var sid= event.request.cookie('sid');
      exports.Session.store.fetch(sid, function(error, session) {
        if( error ) next(error);
        else {
          // If an invalid session id was passed then the id can change
          if( session.id != sid ) 
            event.request.cookie('sid',session.id, set('session cookie'))
            
          event.request.session= session;
          event.request.session.touch();
          next(); 
        }
      });  
      return true;
    },
    
    /**
     * Delegate to store, allowing it to save sessions changes.
     */
    
    response: function(event, next) {
      exports.Session.store.commit(event.request.session, next) 
      return true;
    }
  }
})