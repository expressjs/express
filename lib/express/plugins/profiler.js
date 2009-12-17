
// Express - Profiler - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.Profiler = Plugin.extend({
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
      puts(event.request.method + ' ' + 
           event.request.uri.path + ': ' + 
           (Number(new Date) - this.start) + ' ms')
    }
  }
})