
// Express - Logger - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
 
exports.Logger = Plugin.extend({
  on: {
    response: function(event) {
      var response = event.response,
          request = event.request,
          uri = request.uri,
          headers = request.headers
      puts([headers.host, 
            '-', 
            '-',
            '[' + format(new Date) + ']', 
            '"' + request.method.toUpperCase() + ' ' + uri.path + ' HTTP/' + request.httpVersion + '"',
            response.status,
            response.headers['content-length'] || 0].join(' '))
    }
  }
})