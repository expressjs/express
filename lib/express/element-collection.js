
// Express - ElementCollection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Load libxml support.
 */

var libxml = require('support/libxmljs')

// --- ElementCollection

ElementCollection = Collection.extend({
  
  /**
   * Initialize with string of _markup_.
   *
   * @param  {string} markup
   * @api private
   */
  
  init: function(markup) {
    if (!(/<html>/.test(markup))) 
      markup = '<html><body>' + markup + '</body></html>'
    this.document = libxml.parseString(markup)
    this.arr = [this.document.root()]
  },
  
  /**
   * Return the first element's name.
   *
   * @return {string}
   * @api public
   */
  
  name: function() {
    return this.at(0).name()
  },
  
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