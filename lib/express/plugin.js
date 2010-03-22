
// Express - Plugin - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Push _plugin_ with _options_ to the plugin stack.
 * If _plugin_ has already been pushed, then it's options
 * will override any previously set.
 *
 * @param  {Plugin} plugin
 * @param  {hash} options
 * @api public
 */

exports.use = function(plugin, options) {
  if (Express.environment === 'test' && 'init' in plugin)
    plugin.init(options)
  Express.plugins.each(function(other, i){
    if (other.klass === plugin)
      delete Express.plugins[i]
  })
  Express.plugins.push({
    klass: plugin,
    options: options 
  })
}

// --- Plugin

exports.Plugin = new Class({
  
  /**
   * Trigger handler for the given _event_.
   *
   * @param  {Event} event
   * @api private
   */
  
  trigger: function(event, callback) {
    if ('on' in this)
      if (event.name in this.on)
        return this.on[event.name].call(this, event, callback)
  }
})