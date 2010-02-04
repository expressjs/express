
// Express - Profiler - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var n = 0

exports.Profiler = Plugin.extend({
  extend: {
    
    /**
     * Initialize profiler options.
     *
     * Options:
     *
     *   - format  'plot' outputs request duration in milliseconds only
     *
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      process.mixin(this, options)
    }
  },
  
  // --- Events
  
  on: {
    
    /**
     * Start timer.
     */
    
    request: function(event) {
      this.start = Number(new Date)
    },
    
    /**
     * Output duration.
     */
    
    response: function(event) {
      if (exports.Profiler.format === 'plot')
        puts(Number(new Date) - this.start)
      else
        puts(event.request.method + ' ' + 
             event.request.url.pathname + ': ' + 
             (Number(new Date) - this.start) + ' ms' +
             ' #' + ++n)
    }
  }
})