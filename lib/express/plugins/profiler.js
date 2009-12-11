
// Express - Profiler - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

function usage(label, stats) {
  puts(label)
  puts('  rss        : ' + stats.rss)
  puts('  vsize      : ' + stats.vsize)
  puts('  heap total : ' + stats.heapTotal)
  puts('  heap used  : ' + stats.heapUsed)
}

exports.Profiler = Plugin.extend({
  on: {
    request: function(event) {
      this.start = Number(new Date)
      this.startUsage = process.memoryUsage()
    },
    
    response: function(event) {
      puts('\nduration: ' + (Number(new Date) - this.start) + ' ms')
      usage('start', this.startUsage)
      usage('finish', process.memoryUsage())
    }
  }
})