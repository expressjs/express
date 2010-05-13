
// Express - Logger - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var sys = require('sys'),
    printf = require('ext').printf

/**
 * Log formats
 */
 
var formats = {
  common: function(event, start) {
    printf('%s - - [%s] "%s %s HTTP/%d.%d" %s %d %0.4f',
      event.request.socket.remoteAddress,
      (new Date).format('%d/%b/%Y %H:%M:%S'),
      event.request.method.uppercase,
      event.request.url.pathname || '/',
      event.request.httpVersionMajor,
      event.request.httpVersionMinor,
      event.request.response.status,
      event.request.response.headers['Content-Length'] || 0,
      (Date.now() - start) / 1000)
  },
  combined: function(event, start) {
    formats.common(event, start)
    printf(' "%s" "%s"', 
      event.request.headers['referrer'] || event.request.headers['referer'] || '-',
      event.request.headers['user-agent'])
  },
  plot: function(event, start) {
    sys.print(Date.now() - start)
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
     *       'common'   outputs log in CommonLog format (DEFAULT)
     *       'combined' outputs log in Apache Combined format
     *       'request'  outputs the HTTP request for debugging
     *       'plot'     outputs request duration in milliseconds only
     *
     * @param  {hash} options
     * @api private
     */

    init: function(options) {
      Object.merge(this, options)
    }
  },
  
  on: {
    
    /**
     * Start timer.
     */
    
    request: function(event) {
      this.start = Date.now()
    },
    
    /**
     * Output log data.
     */
    
    response: function(event) {
      formats[exports.Logger.format || 'common'](event, this.start || Date.now())
      sys.print('\n')
    }
  }
})