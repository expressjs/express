
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
   * a new Session is returned.
   *
   * @param  {int} sid
   * @return {Session}
   * @api private
   */
  
  fetch: function(sid, callback) {
    if(sid && this.store[sid]) callback( null, this.store[sid] );
    else this.newSession(callback);
  },
  
  /**
   * Commit _session_ data.
   *
   * @param  {Session} session
   * @api private
   */
  
  commit: function(session, callback) {
    this.store[session.id] = session 
    if( callback ) callback( null , session );
  },
  
  /**
   * Clear all sessions.
   *
   * @api public
   */
  
  clear: function(callback) {
    this.store = {}
    if( callback ) callback();
  },
  
  /**
   * Destroy session using the given _sid_.
   *
   * @param  {int} sid
   * @api public
   */
  
  destroy: function(sid, callback) {
    delete this.store[sid]
    if( callback ) callback();
  },
  
  /**
   * Return the number of sessions currently stored.
   *
   * @return {int}
   * @api public
   */
  
  length: function(callback) {
    callback(null, this.store.values.length);
  },
  
  /**
   * Reap sessions older than _ms_.
   *
   * @param  {int} ms
   * @api private
   */
  
  reap: function(ms, callback) {
    var threshold = Number(new Date(Number(new Date) - ms))
    this.store.each(function(session, sid){
      if (session.lastAccess < threshold)
        this.destroy(sid)
    }, this)
    if( callback ) callback();   
  },

  /**
   * Retrieves a shiny new session
   *
   * @param {function} callback
   * @api private
   */
  newSession: function(callback) {
    callback(null,  new exports.Base(utils.uid()));
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
      var self = this;
      (function _reap() {
        setTimeout(function() {
          try {
            self.store.reap(self.lifetime || (1).day, _reap) 
          }
          catch(e) { 
            puts("Error: Problem during reap: " + e)
            // as long as _reap never throws an exception we'll be ok. 
            // (and the delegated reap method doesn't throw an exception after executing the callback)
            _reap(); 
          }
        }, self.reapInterval || self.reapEvery || (1).hour, this)
      })();
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