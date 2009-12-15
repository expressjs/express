
// Express - Cookie - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var parse = exports.parse = function(cookie) {
  return $(cookie.split(/ *; */)).reduce({}, function(hash, pair){
    var parts = pair.split(/ *= */)
    hash[parts[0].toLowerCase()] = parts[1]
    return hash
  })
}

exports.Cookie = Plugin.extend({

})