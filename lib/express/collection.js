
// Express - Collection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

Collection = Class({
  init: function(arr) {
    var clone = toArray(arr)
    this.length = clone.length
    clone.unshift(0, clone.length)
    Array.prototype.splice.apply(this, clone)
  }
})

exports.$ = function(arr) {
  if (arr instanceof Collection)
    return arr
  return new Collection(arr)
}