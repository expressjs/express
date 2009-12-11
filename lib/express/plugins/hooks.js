
// Express - Hooks - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var before = [],
    after = []

exports.before = function(fn) {
  before.push(fn)
}

exports.after = function(fn) {
  after.push(fn)
}

exports.Hooks = Plugin.extend({
  init: function() {
    this.__super__.apply(arguments)
    process.mixin(GLOBAL, exports)
  },
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