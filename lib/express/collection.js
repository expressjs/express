
// Express - Collection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Throw $break in order to stop iteration.
 */

$break = '__break__'

// --- Collection

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
  
  /**
   * Iterate with _memo_ using callback _fn_.
   * The _memo_ object is passed as the first 
   * argument, and the return value of _fn_ becomes
   * the value of _memo_ providing a functional 
   * approach to reducing a collection.
   *
   * @param  {mixed} memo
   * @param  {function} fn
   * @return {mixed}
   * @api public
   */
  
  reduce: function(memo, fn) {
    this.each(function(val, key){
      memo = fn(memo, val, key)
    })
    return memo
  },
  
  /**
   * Map using callback _fn_, returning a 
   * new collection of return values.
   *
   * @param  {function} fn
   * @return {Collection}
   * @api public
   */
  
  map: function(fn) {
    if (this.arr.map)
      return $(this.arr.map(fn))
    return $(this.reduce([], function(array, val, key){
      array.push(fn(val, key))
      return array
    }))
  },
  
  /**
   * Return the first _n_ value(s), defaults to 1.
   *
   * @param  {int} n
   * @return {mixed}
   * @api public
   */
  
  first: function(n) {
    return n ? this.slice(0, n) : this.at(0)
  },
  
  slice: function(start, end) {
    if (this.arr.slice)
      return $(this.arr.slice(start, end))
    var i = 0
    return $(this.reduce([], function(array, val){
      if (i++ >= start)
        if (i <= end)
          array.push(val)
        else
          throw $break
      return array
    }))
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