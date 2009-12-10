
// Express - Plugin - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- Event

var Event = exports.Event = Class({
  
  /**
   * Initialize with event _name_ and optional _data_.
   *
   * @param  {string} name
   * @param  {hash} data
   * @api private
   */
  
  init: function(name, data) {
    this.name = name
    this.request = Express.server.request
    this.response = Express.server.response
    process.mixin(this, data)
  }
})

// --- Helpers

/**
 * Trigger even _name_ with optional _data_.
 *
 * @param  {string} name
 * @param  {hash} data
 * @api public
 */

exports.trigger = function(name, data) {
  $(Express.plugins).each(function(plugin){
    plugin.trigger(new Event(name, data))
  })
}

/**
 * Push _plugin_ to Express` plugin stack.
 *
 * @param  {Plugin} plugin
 * @api public
 */

exports.use = function(plugin) {
  Express.plugins.push(new plugin)
}

// --- Plugin

exports.Plugin = Class({
  
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