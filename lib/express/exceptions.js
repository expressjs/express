
// Express - Exceptions - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- ExpressError

var ExpressError = exports.ExpressError = Class({
  name: 'ExpressError',
  init: function(message) {
    this.message = message
  },
  toString: function() {
    return this.name + ': ' + this.message
  }
})

// --- InvalidStatusCode

exports.InvalidStatusCode = ExpressError.extend({
  name: 'InvalidStatusCode',
  init: function(status) {
    this.message = status + ' is an invalid HTTP response code'
  }
})

// --- InvalidResponseBody

exports.InvalidResponseBody = ExpressError.extend({
  name: 'InvalidResponseBody',
  init: function(request) {
    this.message = request.method + ' ' + jsonEncode(request.uri.path) + ' did not respond with a body string'
  }
})