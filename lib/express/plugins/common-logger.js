
// Express - CommonLogger - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

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
 
function format(date) {
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

// --- CommonLogger
 
exports.CommonLogger = Plugin.extend({
  on: {
    
    /**
     * Output log data.
     */
    
    response: function(event) {
      puts([event.request.connection.remoteAddress, 
            '-', 
            '-',
            '[' + format(new Date) + ']', 
            '"' + event.request.method.toUpperCase() + ' ' + (event.request.url.pathname || '/') + 
            ' HTTP/' + event.request.httpVersion + '"',
            event.request.response.status,
            event.request.response.headers['content-length'] || 0].join(' '))
    }
  }
})