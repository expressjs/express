
// OO - Class - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)
// Based on http://ejohn.org/blog/simple-javascript-inheritance/
// which is based on implementations by Prototype / base2

;(function(){
  var global = this, initialize = true
  var referencesSuper = /xyz/.test(function(){ xyz }) ? /\b__super__\b/ : /.*/

  /**
   * Shortcut for Class.extend()
   *
   * @param  {hash} props
   * @return {function}
   * @api public
   */

  Class = function(props){
    if (this == global)
      return Class.extend(props)  
  }
  
  // --- Version
  
  Class.version = '1.0.0'
  
  /**
   * Create a new class.
   *
   *   User = Class({
   *     init: function(name){
   *       this.name = name
   *     }
   *   })
   *
   * Classes may be subclassed using the .extend() method, and
   * the associated superclass method via this.__super__().
   *
   *   Admin = User.extend({
   *     init: function(name, password) {
   *       this.__super__(name)
   *       // or this.__super__.apply(this, arguments)
   *       this.password = password
   *     }
   *   })
   *
   * @param  {hash} props
   * @return {function}
   * @api public
   */
  
  Class.extend = function(props) {
    var __super__ = this.prototype
    
    initialize = false
    var prototype = new this
    initialize = true

    for (var name in props)
      prototype[name] = 
        typeof props[name] == 'function' &&
        typeof __super__[name] == 'function' &&
        referencesSuper.test(props[name]) ?
          (function(name, fn){
            return function() {
              this.__super__ = __super__[name]
              return fn.apply(this, arguments)
            }
          })(name, props[name])
        : props[name]
    
    function Class() {
      if (initialize && this.init)
        this.init.apply(this, arguments)
    }
    
    Class.prototype = prototype
    Class.constructor = Class
    Class.extend = arguments.callee
    
    return Class
  }
})()