
// Express - Exceptions - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- ExpressError

ExpressError = Class({
  name: 'ExpressError',
  init: function(message) {
    this.message = message
  },
  toString: function() {
    return this.name + ': ' + this.message
  }
})