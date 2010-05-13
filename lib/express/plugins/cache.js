
// Express - Cache - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var Request = require('express/request').Request

// --- Cache

var Cache = new Class({
  
  /**
   * Initialize cache with _key_ and _val_.
   */
  
  constructor: function(key, val) {
    this.key = key
    this.val = val
    this.created = Date.now()
  }
})

// --- Store

exports.Store = new Class({
  
  /**
   * Ensure that the given _key_ is a string.
   * Override in subclass to provide data-store specific functionality.
   *
   * @param  {string} key
   * @param  {string} val
   * @param  {function} callback
   * @api public
   */
  
  set: function(key, val, callback) {
    if (typeof key !== 'string')
      throw new Error(this.name + ' store #set() key must be a string')
  },
  
  /**
   * Ensure that the given _key_ is a string.
   * Override in subclass to provide data-store specific functionality.
   *
   * @param  {string} key
   * @param  {function} callback
   * @api public
   */
  
  get: function(key, callback) {
    if (typeof key !== 'string')
      throw new Error(this.name + 'store #get() key must be a string')
  },
  
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
   * Initialize data.
   */
  
  constructor: function() {
    this.data = {}
  },
  
  /**
   * Set the given _key_ to _val_.
   *
   * @param  {string} key
   * @param  {string} val
   * @param  {function} callback
   * @return {string}
   * @api public
   */
  
  set: function(key, val, callback) {
    exports.Store.prototype.set.apply(this, arguments)
    this.data[key] = new Cache(key, val)
    if (callback) callback(val)
  },
  
  /**
   * Get data found matching the given _key_.
   *
   * Examples:
   *
   *   cache.get('page:front', function(val){})
   *   // => '<html>...</html>'
   *
   *   cache.get('page:*', function(vals){})
   *   // => { 'page:front': '<html>...</html>', 
   *           'page:users': '<html>...</html>',
   *            ... }
   *
   * @param  {string} key
   * @param  {function} callback
   * @return {mixed}
   * @api public
   */
  
  get: function(key, callback) {
    exports.Store.prototype.get.apply(this, arguments)
    if (key.indexOf('*') === -1)
      return callback(this.data[key] instanceof Cache
        ? this.data[key].val
        : null)
    var regexp = this.normalize(key),
        keys = Object.keys(this.data),
        matches = {}
    for (var i = 0, len = keys.length; i < len; ++i)
      if (regexp.test(keys[i]))
        matches[keys[i]] = this.data[keys[i]].val
    callback(matches)
  },
  
  /**
   * Clear data matching the given _key_.
   *
   * Examples:
   *
   *   cache.clear('page:front', function(){})
   *   cache.clear('page:*', function(){})
   *
   * @param  {string} key
   * @param  {function} callback
   * @api public
   */
  
  clear: function(key, callback) {
    if (key.indexOf('*') === -1)
      delete this.data[key]
    else {
      var regexp = this.normalize(key),
          keys = Object.keys(this.data)
      for (var i = 0, len = keys.length; i < len; ++i)
        if (regexp.test(keys[i]))
          delete this.data[keys[i]]
    }
    callback()
  },
  
  /**
   * Reap caches older than _ms_ or caches which
   * have been "cleared" (null).
   *
   * @param  {int} ms
   * @api private
   */
  
  reap: function(ms) {
    var threshold = +new Date(Date.now() - ms),
        keys = Object.keys(this.data)
    for (var i = 0, len = keys.length; i < len; ++i)
      if (this.data[keys[i]].created < threshold ||
          this.data[keys[i]].val === null)
        this.clear(keys[i], function(){})
  },
  
  /**
   * Convert the given key matching _pattern_ 
   * into a RegExp.
   *
   *  - *  is converted to (.*?)
   *
   * @param  {string} pattern
   * @return {regexp}
   * @api private
   */
  
  normalize: function(pattern) {
    return new RegExp('^' + pattern.replace(/[*]/g, '(.*?)') + '$')
  }
})

// --- Cache

exports.Cache = Plugin.extend({
  extend: {
    
    /**
     * Initialize memory store and start reaper.
     *
     * Options:
     *
     *  - dataStore                constructor name of cache data store, defaults to Store.Memory
     *  - lifetime                 lifetime of cache in milliseconds, defaults to one day
     *  - reapInterval, reapEvery  interval in milliseconds in which to reap old caches, defaults to one hour
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      Object.merge(this, options)
      this.store = new (this.dataStore || exports.Store.Memory)(options)
      Request.include({ cache: this.store })
      this.startReaper()
    },
    
    /**
     * Start reaper.
     *
     * @api private
     */
    
    startReaper: function() {
      setInterval(function(self){
        self.store.reap(self.lifetime || (1).day)
      }, this.reapInterval || this.reapEvery || (1).hour, this)
    }
  }
})