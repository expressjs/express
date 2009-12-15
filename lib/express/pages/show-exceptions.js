
// Express - Show Exceptions - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var style = require('express/pages/style').style

exports.render = function(e) {
  contentType('html')
  if (e.stack)
    var stack = $(e.stack.split('\n').slice(1)).map(function(val, i){
      if (!i)
        return '<li>' + val.replace(/^(.*?):/, '<span class="path">$1</span>:') + '</li>'
      return '<li>' + val
        .replace(/\(([^:]+)/, '(<span class="path">$1</span>')
        .replace(/(:\d+:\d+)/, '<span class="line">$1</span>') + 
        '</li>'
    }).toArray().join('\n')
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
            ' + stack + '                            \n\
          </ul>                                      \n\
        </div>                                       \n\
      </body>                                        \n\
    </html>'
}