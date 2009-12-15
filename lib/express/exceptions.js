
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

// --- InvalidResponseBody

InvalidResponseBody = ExpressError.extend({
  name: 'InvalidResponseBody',
  init: function(request) {
    this.message = request.method + ' ' + JSON.encode(request.uri.path) + ' did not respond with a body string'
  }
})