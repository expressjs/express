
// Express - Pages - Show Exceptions - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var sys = require('sys'),
    style = require('express/pages/style').style
    

/**
 * Return list items for exception _e_'s stack.
 *
 * @param  {Error} e
 * @return {string}
 * @api private
 */

function stack(e) {
  if (e.stack)
    return e.stack.split('\n').slice(1).map(function(val, i){
      if (!i)
        return '<li>' + val.replace(/^(.*?):/, '<span class="path">$1</span>:') + '</li>'
      return '<li>' + val
        .replace(/\(([^:]+)/, '(<span class="path">$1</span>')
        .replace(/(:\d+:\d+)/, '<span class="line">$1</span>') + 
        '</li>'
    }).join('\n')
}

/**
 * Return table rows for _hash_.
 *
 * @param  {object} hash
 * @return {string}
 * @api private
 */

function hash(hash) {
  var keys = Object.keys(hash),
      buf = []
  if (!keys.length) return '<tr><td class="empty" colspan="2">Empty</td></tr>'
  for (var i = 0, len = keys.length; i < len; ++i)
    buf.push('<tr><td>' + keys[i] + ':</td><td>' + sys.inspect(hash[keys[i]]) + '</td></tr>')
  return buf.join('\n')
}

/**
 * Return plain-text list items for exception _e_'s stack.
 *
 * @param  {Error} e
 * @return {string}
 * @api private
 */

function stackText(e) {
  if (e.stack)
    return e.stack.split('\n').slice(1).map(function(val, i){
      return '\n   ' + val.strip
    }).join('')
}

/**
 * Return an ascii table for _hash_.
 *
 * @param  {object} hash
 * @return {string}
 * @api private
 */

function hashText(hash) {
  var keys = Object.keys(hash),
      buf = ''
  if (!keys.length) return '\n  Empty'
  for (var i = 0, len = keys.length; i < len; ++i)
    buf += '\n  ' + keys[i] + ': ' + sys.inspect(hash[keys[i]])
  return buf
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
            ' + hash(request.headers) + '            \n\
          </table>                                   \n\
          <h3>Response</h3>                          \n\
          <table id="response-headers">              \n\
            ' + hash(request.response.headers) + '   \n\
          </table>                                   \n\
          <h3>Params</h3>                            \n\
          <table id="route-params">                  \n\
            ' + hash(request.params.path) + '        \n\
          </table>                                   \n\
          <h3>GET</h3>                               \n\
          <table id="get-params">                    \n\
            ' + hash(request.params.get) + '         \n\
          </table>                                   \n\
          <h3>POST</h3>                              \n\
          <table id="post-params">                   \n\
            ' + hash(request.params.post) + '        \n\
          </table>                                   \n\
        </div>                                       \n\
      </body>                                        \n\
    </html>'
}

exports.renderText = function(request, e) {
  request.contentType('text')
  return '\
  \n Express \
  \n\n   500 ' + e + ' \
  \n' + stackText(e) + ' \
  \n\n Request\n ' + hashText(request.headers) + '\
  \n\n Response\n ' + hashText(request.response.headers) + '\
  \n\n Params\n ' + hashText(request.params.path) + '\
  \n\n GET\n ' + hashText(request.params.get) + '\
  \n\n POST\n ' + hashText(request.params.post) + '\n'
}

exports.renderJSON = function(request, e) {
  request.contentType('json')
  delete e.stack
  return JSON.encode({ error: e })
}
