
// Express - Plugin - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Push _plugin_ with _options_ to the plugin stack.
 *
 * @param  {Plugin} plugin
 * @param  {hash} options
 * @api public
 */

exports.use = function(plugin, options) {
  if ('init' in plugin) plugin.init()
  Express.plugins.push({
    klass: plugin,
    options: options 
  })
}

// --- Plugin

exports.Plugin = Class({
  
  /**
   * Initialize with _options_.
   *
   * @param  {hash} options
   * @api private
   */
  
  init: function(options) {
    if (options)
      process.mixin(this, options)
  },
  
  /**
   * Trigger handler for the given _event_.
   *
   * @param  {Event} event
   * @api private
   */
  
  trigger: function(event) {
    if ('on' in this)
      if (event.name in this.on)
        this.on[event.name].call(this, event)
  }
})