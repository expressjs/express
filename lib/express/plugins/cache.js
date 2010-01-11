
// Express - Cache - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

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
    return this.data[key] = val
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
      return this.data[key]
    var vals = {},
        regexp = this.normalize(key)
    for (var key in this.data)
      if (this.data.hasOwnProperty(key))
        if (regexp.test(key))
          vals[key] = this.data[key]
    return vals 
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

exports.Cache = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      Request.include({
        cache: new exports.Store.Memory
      })
    }
  }
})