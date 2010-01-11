
// Express - Cache - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- Store

exports.Store = Class({
  toString: function() {
    return '[' + this.name + ' Store]'
  }
})

// --- Store.Memory

exports.Store.Memory = exports.Store.extend({
  name: 'Memory'
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