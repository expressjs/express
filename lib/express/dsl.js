
// Express - DSL - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.set = function(option, val) {
  return val == undefined ?
    Express.settings[option] :
      Express.settings[option] = val
}

exports.enable = function(option) {
  set(option, true)
}

exports.disable = function(option) {
  set(option, false)
}

exports.run = function() {
  Express.server.run()
}