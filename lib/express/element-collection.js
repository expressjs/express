
// Express - ElementCollection - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Load libxml support.
 */

var libxml = require('libxmljs')

// --- css2xpath

/** version 0.1 2009-04-30
 * @author      Andrea Giammarchi
 * @license     Mit Style License
 * @project     http://code.google.com/p/css2xpath/
 */
var css2xpath=(function(){var b=[/\[([^\]~\$\*\^\|\!]+)(=[^\]]+)?\]/g,"[@$1$2]",/\s*,\s*/g,"|",/\s*(\+|~|>)\s*/g,"$1",/([a-zA-Z0-9\_\-\*])~([a-zA-Z0-9\_\-\*])/g,"$1/following-sibling::$2",/([a-zA-Z0-9\_\-\*])\+([a-zA-Z0-9\_\-\*])/g,"$1/following-sibling::*[1]/self::$2",/([a-zA-Z0-9\_\-\*])>([a-zA-Z0-9\_\-\*])/g,"$1/$2",/\[([^=]+)=([^'|"][^\]]*)\]/g,"[$1='$2']",/(^|[^a-zA-Z0-9\_\-\*])(#|\.)([a-zA-Z0-9\_\-]+)/g,"$1*$2$3",/([\>\+\|\~\,\s])([a-zA-Z\*]+)/g,"$1//$2",/\s+\/\//g,"//",/([a-zA-Z0-9\_\-\*]+):first-child/g,"*[1]/self::$1",/([a-zA-Z0-9\_\-\*]+):last-child/g,"$1[not(following-sibling::*)]",/([a-zA-Z0-9\_\-\*]+):only-child/g,"*[last()=1]/self::$1",/([a-zA-Z0-9\_\-\*]+):empty/g,"$1[not(*) and not(normalize-space())]",/([a-zA-Z0-9\_\-\*]+):not\(([^\)]*)\)/g,function(f,e,d){return e.concat("[not(",a(d).replace(/^[^\[]+\[([^\]]*)\].*$/g,"$1"),")]")},/([a-zA-Z0-9\_\-\*]+):nth-child\(([^\)]*)\)/g,function(f,e,d){switch(d){case"n":return e;case"even":return"*[position() mod 2=0 and position()>=0]/self::"+e;case"odd":return e+"[(count(preceding-sibling::*) + 1) mod 2=1]";default:d=(d||"0").replace(/^([0-9]*)n.*?([0-9]*)$/,"$1+$2").split("+");d[1]=d[1]||"0";return"*[(position()-".concat(d[1],") mod ",d[0],"=0 and position()>=",d[1],"]/self::",e)}},/:contains\(([^\)]*)\)/g,function(e,d){return"[contains(string(.),'"+d+"')]"},/\[([a-zA-Z0-9\_\-]+)\|=([^\]]+)\]/g,"[@$1=$2 or starts-with(@$1,concat($2,'-'))]",/\[([a-zA-Z0-9\_\-]+)\*=([^\]]+)\]/g,"[contains(@$1,$2)]",/\[([a-zA-Z0-9\_\-]+)~=([^\]]+)\]/g,"[contains(concat(' ',normalize-space(@$1),' '),concat(' ',$2,' '))]",/\[([a-zA-Z0-9\_\-]+)\^=([^\]]+)\]/g,"[starts-with(@$1,$2)]",/\[([a-zA-Z0-9\_\-]+)\$=([^\]]+)\]/g,function(f,e,d){return"[substring(@".concat(e,",string-length(@",e,")-",d.length-3,")=",d,"]")},/\[([a-zA-Z0-9\_\-]+)\!=([^\]]+)\]/g,"[not(@$1) or @$1!=$2]",/#([a-zA-Z0-9\_\-]+)/g,"[@id='$1']",/\.([a-zA-Z0-9\_\-]+)/g,"[contains(concat(' ',normalize-space(@class),' '),' $1 ')]",/\]\[([^\]]+)/g," and ($1)"],c=b.length;return function a(e){var d=0;while(d<c){e=e.replace(b[d++],b[d++])}return"//"+e}})();

// --- ElementCollection

ElementCollection = Collection.extend({
  
  /**
   * Initialize with string of _markup_.
   *
   * @param  {string} markup
   * @api private
   */
  
  init: function(markup) {
    if (typeof markup != 'string')
      return this.__super__(markup)
    if (!(/<html>/.test(markup))) 
      markup = '<html><body>' + markup + '</body></html>'
    this.document = libxml.parseHtmlString(markup)
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
   * Search child elements with the given _xpath_.
   *
   * @param  {string} xpath
   * @return {ElementCollection}
   * @api public
   */
  
  xpath: function(xpath) {
    // TODO: refactor with flatten()
    return $(this.reduce([], function(array, e){
      $(e.find(xpath)).each(function(child){
        array.push(child)
      })
      return array
    }))
  },
  
  /**
   * Search child elements with the given css _selector_
   *
   * @param  {string} selector
   * @return {ElementCollection}
   * @api public
   */
  
  search: function(selector) {
    return this.xpath(css2xpath(selector))
  },
  
  /**
   * Return collection of children.
   *
   * @return {ElementCollection}
   * @api public
   */
  
  children: function() {
    // TODO: refactor with flatten()
    return $(this.reduce([], function(array, e){
      $(e.children()).each(function(child){
        array.push(child)
      })
      return array
    }))
  },
  
  /**
   * Return collection of parents.
   *
   * @return {ElementCollection}
   * @api public
   */
  
  parents: function() {
    return this.map(function(e){
      return e.parent()
    })
  },
  
  /**
   * Return the first element's parent.
   *
   * @return {ElementCollection}
   * @api public
   */
  
  parent: function() {
    return $([this.at(0).parent()])
  },
  
  /**
   * Return the prev element.
   *
   * @return {ElementCollection}
   * @api public
   */
  
  prev: function() {
    return $([this.at(0).prev_sibling()])
  },
    
  /**
   * Return the next element.
   *
   * @return {ElementCollection}
   * @api public
   */
  
  next: function() {
    return $([this.at(0).next_sibling()])
  },
  
  /**
   * Return the first element's text content.
   *
   * @return {string}
   * @api public
   */
  
  text: function() {
    return this.at(0).text()
  },
  
  /**
   * Convert collection to a string.
   *
   * @return {string}
   * @api public
   */
  
  toString: function() {
    if (this.at(0) && this.at(0).doc)
      return '[Collection <elements>]'
    return this.__super__()
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
  if (arr instanceof Collection) return arr
  return new ElementCollection(arr)
}