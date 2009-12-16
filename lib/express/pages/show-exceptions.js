
// Express - Pages - Show Exceptions - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var style = require('express/pages/style').style

/**
 * Return list items for exception _e_'s stack.
 *
 * @param  {object} e
 * @return {string}
 * @api private
 */

function stack(e) {
  if (e.stack)
    return $(e.stack.split('\n').slice(1)).map(function(val, i){
      if (!i)
        return '<li>' + val.replace(/^(.*?):/, '<span class="path">$1</span>:') + '</li>'
      return '<li>' + val
        .replace(/\(([^:]+)/, '(<span class="path">$1</span>')
        .replace(/(:\d+:\d+)/, '<span class="line">$1</span>') + 
        '</li>'
    }).join('\n')
}

/**
 * Return table rows for headers _hash_.
 *
 * @param  {hash} hash
 * @return {string}
 * @api private
 */

function headers(hash) {
  return $(hash).map(function(val, key){
    return '<tr><td>' + key + ':</td><td>' + val + '</td></tr>'
  }).join('\n')
}

exports.render = function(request, e) {
  request.contentType('html')
  return '<html>                                     \n\
      <head>                                         \n\
        <title>Express -- ' + e + '</title>          \n\
        ' + style + '                                \n\
      </head>                                        \n\
      <body>                                         \n\
        <div id="wrapper">                           \n\
          <h1>Express</h1>                           \n\
          <h2><em>500</em> ' + e + '</h2>            \n\
          <ul id="stacktrace">                       \n\
            ' + stack(e) + '                         \n\
          </ul>                                      \n\
          <h3>Request</h3>                           \n\
          <table id="request-headers">               \n\
            ' + headers(request.headers) + '         \n\
          </table>                                   \n\
          <h3>Response</h3>                          \n\
          <table id="response-headers">              \n\
            ' + headers(request.response.headers) + '\n\
          </table>                                   \n\
        </div>                                       \n\
      </body>                                        \n\
    </html>'
}