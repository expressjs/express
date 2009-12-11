
// Express - ElementCollection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var xml = require('support/libxmljs')

ElementCollection = Collection.extend({
  
  /**
   * Convert collection to a string.
   *
   * @return {string}
   * @api public
   */
  
  toString: function() {
    return '[ElementCollection ' + this.arr + ']'
  }
})

/**
 * Add markup support to $().
 *
 * @param  {object} arr
 * @return {Collection, ElementCollection}
 * @api public
 */
 
var $ = exports.$ = function(arr) {
  if (typeof arr == 'string') return new ElementCollection(arr)
  return require('express/collection').$(arr)
}