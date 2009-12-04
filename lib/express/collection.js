
// Express - Collection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

$break = '__break__'

Collection = Class({
  
  /**
   * Initialize collection with an array-like object.
   *
   * @param  {object} arr
   * @api private
   */
  
  init: function(arr) {
    this.arr = arr
  },
  
  /**
   * Return the value of _index_ or null.
   *
   * @param  {int} index
   * @return {mixed}
   * @api public
   */
  
  at: function(index) {
    if ('length' in this.arr)
      return this.arr[index]
    var result, i = 0
    this.each(function(val){
      if (i++ == index) {
        result = val
        throw $break
      }
    })
    return result
  },
  
  /**
   * Iterate collection using callback _fn_,
   * passing both the value and index.
   *
   * @param  {function} fn
   * @return {Collection}
   * @api public
   */
  
  each: function(fn) {
    try {
      if (this.arr.forEach)
        this.arr.forEach(fn)
      else
        for (var key in this.arr)
          if (this.arr.hasOwnProperty(key))
            fn(this.arr[key], key)
    }
    catch (e) {
      if (e != $break) throw e
    }
    return this
  },
  
  map: function(fn) {
    if (this.arr.map)
      return $(this.arr.map(fn))
    var result = []
    this.each(function(key, val){
      result.push(fn(key, val))
    })
    return $(result)
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
  if (arr instanceof Collection) return arr
  return new Collection(arr)
}