
// Express - Pages - Not Found - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var style = require('express/pages/style').style

exports.render = function() {
  contentType('html')
  var request = Express.server.request,
      method = request.method,
      path = request.uri.path
  return '<html>                                         \n\
      <head>                                             \n\
        <title>Express -- Not Found</title>              \n\
        ' + style + '                                    \n\
      </head>                                            \n\
      <body>                                             \n\
        <div id="wrapper">                               \n\
          <h1>Express</h1>                               \n\
          <h2><em>404</em> Not Found</h2>                \n\
          <ul id="stacktrace">                           \n\
            ' + method + '(\'' + path + '\', function(){ \n\
              // Try this :)                             \n\
            })                                           \n\
          </ul>                                          \n\
        </div>                                           \n\
      </body>                                            \n\
    </html>'
}