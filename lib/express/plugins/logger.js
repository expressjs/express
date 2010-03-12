
// Express - Logger - Copyright Aaron Heckmann <aaronheckmann+express@gmail.com> (MIT Licensed)

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
      formatDate(new Date),
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
    return Number(new Date) - start
  }
}


/**
 * Months.
 */

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Format _date_.
 *
 * @param  {Date} date
 * @return {string}
 * @api private
 */
 
function formatDate(date) {
  var d = date.getDate(),
      m = months[date.getMonth()],
      y = date.getFullYear(),
      h = date.getHours(),
      mi = date.getMinutes(),
      s = date.getSeconds()
  return (d < 10 ? '0' : '') + d + '/' + m + '/' + y + ' ' +
         (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + 
         mi + ':' + (s < 10 ? '0' : '') + s
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