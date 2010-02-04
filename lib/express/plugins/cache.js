
// Express - Cache - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- Cache

var Cache = Class({
  
  /**
   * Initialize cache with _key_ and _val_.
   */
  
  init: function(key, val) {
    this.key = key
    this.val = val
    this.created = Number(new Date)
  }
})

// --- Store

exports.Store = Class({
  
  /**
   * Ensure that the given _key_ is a string.
   * Override in subclass to provide data-store specific functionality.
   *
   * @param  {string} key
   * @param  {string} val
   * @api public
   */
  
  set: function(key, val) {
    if (typeof key !== 'string') throw new Error(this.name + ' store #set() key must be a string')
  },
  
  /**
   * Ensure that the given _key_ is a string.
   * Override in subclass to provide data-store specific functionality.
   *
   * @param  {string} key
   * @api public
   */
  
  get: function(key) {
    if (typeof key !== 'string') throw new Error(this.name + 'store #get() key must be a string')
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
  
  init: function() {
    this.data = {}
  },
  
  /**
   * Set the given _key_ to _val_, returning _val_.
   *
   * @param  {string} key
   * @param  {string} val
   * @return {string}
   * @api public
   */
  
  set: function(key, val) {
    this.__super__(key, val)
    return this.data[key] = new Cache(key, val), val
  },
  
  /**
   * Get data found matching the given _key_.
   *
   * Examples:
   *
   *   cache.get('page:front')
   *   // => '<html>...</html>'
   *
   *   cache.get('page:*')
   *   // => { 'page:front': '<html>...</html>', 
   *           'page:users': '<html>...</html>',
   *            ... }
   *
   * @param  {string} key
   * @return {mixed}
   * @api public
   */
  
  get: function(key) {
    this.__super__(key)
    if (key.indexOf('*') === -1)
      return this.data[key] instanceof Cache ?
        this.data[key].val :
          null
    var regexp = this.normalize(key)      
    return $(this.data).reduce({}, function(vals, cache){
      if (regexp.test(cache.key))
        vals[cache.key] = cache.val
      return vals
    })
  },
  
  /**
   * Clear data matching the given _key_.
   *
   * Examples:
   *
   *   cache.clear('page:front')
   *   cache.clear('page:*')
   *
   * @param  {string} key
   * @api public
   */
  
  clear: function(key) {
    if (key.indexOf('*') === -1)
      return delete this.data[key]
    var regexp = this.normalize(key)
    for (var key in this.data)
      if (this.data.hasOwnProperty(key))
        if (regexp.test(key))
          delete this.data[key]
  },
  
  /**
   * Reap caches older than _ms_.
   *
   * @param  {int} ms
   * @api private
   */
  
  reap: function(ms) {
    var self = this,
        threshold = Number(new Date(Number(new Date) - ms))
    $(this.data).each(function(cache){
      if (cache.created < threshold)
        self.clear(cache.key)
    })
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
      process.mixin(this, options)
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
      var self = this,
          oneDay = 86400000,
          oneHour = 3600000
      setInterval(function(){
        self.store.reap(self.lifetime || oneDay)
      }, self.reapInterval || self.reapEvery || oneHour)
    }
  }
})