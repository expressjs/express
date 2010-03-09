
// Express - Collection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var utils = require('express/utils')

/**
 * Throw $break in order to stop iteration.
 */

$break = '__break__'

var property = /^\w+$/,
    method = /^\w+\(/

/**
 * Normalize callback _fn_. When a string is
 * passed convert the shorthand expr to a function.
 *
 *  - Functions are passed through un-touched
 *  - Strings with length of < 4 are considered operators between a and b
 *  - Single words are considered properties on a
 *  - Single functions are considered method calls on a
 *  - Larger strings are considered return expressions
 *
 * @param  {string, function} fn
 * @return {function}
 * @api private
 */

function callback(fn) {
  if (fn === undefined) return
  if (fn instanceof Function) return fn
  if (fn.length < 4) return Function('a, b, c', 'return a ' + fn + ' b')
  if (property.test(fn) || method.test(fn)) fn = 'a.' + fn
  return Function('a, b, c', 'return ' + fn)
}

// --- Collection

Collection = Class({
  
  /**
   * Initialize collection with an array-like object.
   *
   * @param  {object} arr
   * @api private
   */
  
  init: function(arr) {
    this.arr = arr || []
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
   * Reverse a collection.
   *
   * @return {Collection}
   * @api public
   */
  
  reverse: function() {
    if (this.arr.reverse)
      return $(this.arr.reverse())
    return this
  },
  
  /**
   * Join a collection with the given _str_ or ''.
   *
   * @param  {string} str
   * @return {string}
   * @api public
   */
  
  join: function(str) {
    return this.toArray().join(str || '')
  },
  
  /**
   * Sort collection with optional _fn_.
   *
   * @param  {function} fn
   * @return {Collection}
   * @warn converts to array
   * @api public
   */
  
  sort: function(fn) {
    fn = callback(fn)
    return $(this.toArray().sort(fn))
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
    fn = callback(fn)
    if (this.arr.reduce)
      return this.arr.reduce(fn, memo)
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
    fn = callback(fn)
    if (this.arr.map)
      return $(this.arr.map(fn))
    return $(this.reduce([], function(array, val, key){
      array.push(fn(val, key))
      return array
    }))
  },
  
  /**
   * Return collection of values when _fn_ evaluates
   * to true.
   *
   * @param  {function} fn
   * @return {Collection}
   * @api public
   */
  
  select: function(fn) {
    fn = callback(fn)
    return $(this.reduce([], function(array, val, key){
      if (fn(val, key))
        array.push(val)
      return array
    }))
  },
  
  /**
   * Return collection of values when _fn_ evaluates
   * to false.
   *
   * @param  {function} fn
   * @return {Collection}
   * @api public
   */
  
  reject: function(fn) {
    fn = callback(fn)
    return $(this.reduce([], function(array, val, key){
      if (!fn(val, key))
        array.push(val)
      return array
    }))
  },
  
  /**
   * Check if all arguments passed are found within 
   * the collection using the === operator.
   *
   * @return {bool}
   * @api public
   */
  
  includes: function() {
    var self = this
    return $(arguments).all(function(arg){
      return self.any(function(val){
        return val === arg
      })
    })
  },
    
  /**
   * Return the first _n_ value(s), defaults to 1.
   *
   * @param  {int} n
   * @return {mixed}
   * @api public
   */
  
  first: function(n) {
    return n ? 
      this.slice(0, n) :
        this.at(0)
  },
  
  /**
   * Return the last _n_ value(s), defaults to -1.
   *
   * @param  {int} n
   * @return {mixed}
   * @api public
   */
  
  last: function(n) {
    var len = this.length()
    return n ? 
      this.slice(len - n, len) :
        this.at(--len)
  },
  
  /**
   * Drop the first _n_ values, returning the others.
   *
   * @param  {int} n
   * @return {Collection}
   * @api public
   */
  
  drop: function(n) {
    return this.slice(n, this.length())
  },
  
  /**
   * Return a slice of values from _start_ to _end_.
   *
   * @param  {int} start
   * @param  {int} end
   * @return {Collection}
   * @api public
   */
  
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
  },
  
  /**
   * Iterate until _fn_ evaluates to true, then
   * return the matching value.
   *
   * @param  {function} fn
   * @return {mixed}
   * @api public
   */
  
  find: function(fn) {
    var result, fn = callback(fn)
    this.each(function(val, key){
      if (fn(val, key)) {
        result = val
        throw $break
      }
    })
    return result
  },
  
  /**
   * Return true if _fn_ ever evaluates to true, otherwise
   * returns false.
   *
   * @param  {function} fn
   * @return {bool}
   * @api public
   */
  
  any: function(fn) {
    fn = callback(fn)
    if (this.arr.some)
      return this.arr.some(fn)
    return !! this.find(fn)
  },
  
  /**
   * Returns true if _fn_ always evaluates to true, otherwise
   * returns false.
   *
   * @param  {function} fn
   * @return {bool}
   * @api public
   */
  
  all: function(fn) {
    fn = callback(fn)
    if (this.arr.every)
      return this.arr.every(fn)
    return this.reduce(true, function(state, val, key){
      if (!state) throw $break
      return !! fn(val, key)
    })
  },
  
  /**
   * Select values matching _pattern_
   *
   * @param  {regexp} pattern
   * @return {Collection}
   * @api public
   */
  
  grep: function(pattern) {
    return this.select(function(val){
      return pattern.exec(val)
    })
  },
  
  /**
   * Return keys as a collection.
   *
   * @return {Collection}
   * @api public
   */
  
  keys: function() {
    return $(Object.keys(this.arr))
  },
  
  /**
   * Convert a collection to a true array.
   * Works recursively
   *
   * @return {array}
   * @api public
   */
  
  toArray: function() {
    return this.reduce([], function(array, val){
      val instanceof Collection ?
        array.push(val.toArray()) :
          array.push(val)
      return array
    })
  },
  
  /**
   * Return the lowest number in the collection.
   *
   * @return {number}
   * @api public
   */
  
  min: function() {
    return this.reduce(null, function(min, val){
      return min === null ? val :
          val < min ? val :
            min
    })
  },
  
  /**
   * Return the largest number in the collection.
   *
   * @return {number}
   * @api public
   */
  
  max: function() {
    return this.reduce(null, function(max, val){
      return max === null ? val :
        val > max ? val :
          max
    })
  },
  
  /**
   * Group collection into several collections grouped by _size_.
   *
   * @param  {int} size
   * @return {Collection}
   * @api public
   */
  
  chunk: function(size) {
    var len = this.arr.length, 
        chunks = [], chunk = [], i = 0 
    this.each(function(val, key){
      chunk.push(val)
      if (i++ > 0 && (i % size == 0 || i == len))
        chunks.push($(chunk)),
        chunk = []
    })
    return $(chunks)
  },
  
  /**
   * Return the length of this collection.
   *
   * @return {int}
   * @api public
   */
  
  length: function() {
    if ('length' in this.arr)
      return this.arr.length
    return this.reduce(0, function(len){
      return ++len
    })
  },
  
  /**
   * Return the sum of numeric values in this collection.
   *
   * @return {number}
   * @api public
   */
  
  sum: function() {
    return this.reduce(0, function(sum, n){
      return sum + n
    })
  },
  
  /**
   * Return the average of numeric values in this collection.
   *
   * @return {number}
   * @api public
   */
  
  avg: function() {
    return this.sum() / this.length()
  },
  
  /**
   * Merge _other_ with this collection.
   *
   * @param  {mixed} other
   * @return {Collection}
   * @api public
   */
  
  merge: function(other) {
    if (this.arr instanceof Array)
      return $($(other).reduce(this.arr, function(array, val){
        array.push(val)
        return array
      }))
    else
      return $(utils.mixin(this.arr, $(other).arr))
  },
  
  /**
   * Clone the collection.
   *
   * @return {Collection}
   * @api public
   */
  
  clone: function() {
    return $(utils.clone(this.arr))
  },
  
  /**
   * Return the value of a random index.
   *
   * @return {mixed}
   * @api public
   */
  
  sample: function() {
    return this.at(Math.floor(Math.random() * this.length()))
  },
  
  /**
   * Convert collection to a string.
   *
   * @return {string}
   * @api public
   */
  
  toString: function() {
    return '[Collection ' + this.arr + ']'
  }
})

/**
 * Create a new collection from an array-like object.
 *
 * @param  {object} arr
 * @return {Collection}
 * @api public
 */

var $ = exports.$ = function(arr) {
  if (arr instanceof Collection) return arr
  return new Collection(arr)
}