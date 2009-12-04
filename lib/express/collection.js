
// Express - Collection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

Collection = Class({
  
  /**
   * Initialize collection with an array-like object.
   *
   * @param  {object} arr
   * @api private
   */
  
  init: function(arr) {
    var clone = toArray(arr)
    this.length = clone.length
    clone.unshift(0, clone.length)
    Array.prototype.splice.apply(this, clone)
  }
})

/**
 * Create a new collection from an array-like object.
 *
 * @param  {object} arr
 * @return {Collection}
 * @api public
 */

exports.$ = function(arr) {
  if (arr instanceof Collection)
    return arr
  return new Collection(arr)
}