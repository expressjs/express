
// Express - Hooks - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.callbacks = { before: [], after: [] }

/**
 * Add a _fn_ to be excuted before a request.
 *
 * @param  {function} fn
 * @api public
 */

exports.before = function(fn) {
  exports.callbacks.before.push(fn)
}

/**
 * Add a _fn_ to be excuted after a request.
 *
 * @param  {function} fn
 * @api public
 */

exports.after = function(fn) {
  exports.callbacks.after.push(fn)
}

// --- Hooks

exports.Hooks = Plugin.extend({
  extend: {
    
    /**
     * Initialize extensions.
     */
    
    init: function() {
      process.mixin(GLOBAL, { before: exports.before,
                              after: exports.after })
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Invoke all before handlers.
     */
    
    request: function(event) {
      $(exports.callbacks.before).each(function(fn){
        fn.call(event.request, event.request)
      })
    },
    
    /**
     * Invoke all after handlers.
     */
    
    response: function(event) {
      $(exports.callbacks.after).each(function(fn){
        fn.call(event.request, event.request)
      })
    }
  }
})