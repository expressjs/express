
// Express - Logger - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var sys = require('sys')

/**
 * Log formats
 */
 
var formats = {
  common: function(event, start) {
    printf('%s - - [%s] "%s %s HTTP/%d" %s %d %0.3f',
      event.request.connection.remoteAddress,
      (new Date).format('%d/%b/%Y %H:%M:%S'),
      event.request.method.uppercase,
      event.request.url.pathname || '/',
      event.request.httpVersion,
      event.request.response.status,
      event.request.response.headers['content-length'] || 0,
      (Number(new Date) - start) / 1000)
  },
  combined: function(event, start) {
    formats.common(event, start)
    printf('"%s" "%s"', 
      event.request.headers['referrer'] || event.request.headers['referer'] || '-',
      event.request.headers['user-agent'])
  },
  plot: function(event, start) {
    sys.print(Number(new Date) - start)
  }
}

// --- Logger

exports.Logger = Plugin.extend({ 
  extend: {
    
    /**
     * Initialize logger options.
     *
     * Options:
     *
     *   - format
     *       'common' outputs log in CommonLog format (DEFAULT)
     *       'combined' outputs log in Apache Combined format
     *       'plot' outputs request duration in milliseconds only
     *
     * @param  {hash} options
     * @api private
     */

    init: function(options) {
      this.merge(options || {})
    }
  },
  
  on: {
    
    /**
     * Start timer.
     */
    
    request: function(event) {
      this.start = Number(new Date)
    },
    
    /**
     * Output log data.
     */
    
    response: function(event) {
      formats[exports.Logger.format || 'common'](event, this.start)
      sys.print('\n')
    }
  }
})