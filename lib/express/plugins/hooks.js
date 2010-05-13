
// Express - Hooks - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Callbacks.
 */

exports.callbacks = { before: [], after: [] }

/**
 * Add a _callback_ to be excuted before a request.
 *
 * @param  {function} callback
 * @api public
 */

exports.before = function(callback) {
  exports.callbacks.before.push(callback)
}

/**
 * Add a _callback_ to be excuted after a request.
 *
 * @param  {function} callback
 * @api public
 */

exports.after = function(callback) {
  exports.callbacks.after.push(callback)
}

// --- Hooks

exports.Hooks = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      Object.merge(global, {
        before: exports.before,
        after: exports.after
      })
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Invoke all before handlers.
     */
    
    request: function(event) {
      exports.callbacks.before.each(function(callback){
        callback.call(event.request, event.request)
      })
    },
    
    /**
     * Invoke all after handlers.
     */
    
    response: function(event) {
      exports.callbacks.after.each(function(callback){
        callback.call(event.request, event.request)
      })
    }
  }
})