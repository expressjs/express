
// Express - Plugin - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- Event

var Event = exports.Event = Class({
  init: function(name) {
    this.name = name
    this.request = Express.server.request
    this.response = Express.server.response
  }
})

// --- Helpers

exports.trigger = function(name) {
  $(Express.plugins).each(function(plugin){
    plugin.trigger(new Event(name))
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
  trigger: function(e) {
    if ('on' in this)
      if (e.name in this.on)
        this.on[e.name].call(this, e)
  }
})