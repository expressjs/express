
// Express - Helpers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.jsonEncode = function(object) {
  return JSON.stringify(object)
}

exports.dirname = function(path) {
  return path.split('/').slice(0, -1).join('/')
}

exports.param = function(key) {
  return Express.server.router.params[key]
}