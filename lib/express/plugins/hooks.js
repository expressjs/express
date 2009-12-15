
// Express - Hooks - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var before = [],
    after = []

/**
 * Add a _fn_ to be excuted before a request.
 *
 * @param  {function} fn
 * @api public
 */

exports.before = function(fn) {
  before.push(fn)
}

/**
 * Add a _fn_ to be excuted after a request.
 *
 * @param  {function} fn
 * @api public
 */

exports.after = function(fn) {
  after.push(fn)
}

// --- Expose

process.mixin(GLOBAL, exports)

// --- Hooks

exports.Hooks = Plugin.extend({
  on: {
    request: function(event) {
      $(before).each(function(fn){
        fn(event)
      })
    },
    
    response: function(event) {
      $(after).each(function(fn){
        fn(event)
      })
    }
  }
})