
// Express - Pages - Not Found - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var style = require('express/pages/style').style

exports.render = function(request) {
  request.contentType('html')
  var method = request.method.toLowerCase(),
      path = request.url.pathname || '/'
  return '<html>                                         \n\
      <head>                                             \n\
        <title>Express -- Not Found</title>              \n\
        ' + style + '                                    \n\
      </head>                                            \n\
      <body>                                             \n\
        <div id="wrapper">                               \n\
          <h1>Express</h1>                               \n\
          <h2><em>404</em> Not Found</h2>                \n\
          <p>No routes were matched, try the route below.\n\
          For restful services ensure that you use(<strong>MethodOverride</strong>).</p> \n\
          <pre><code>                                    \n\
  ' + method + '(\'' + path + '\', function(){           \n\
    // Response logic                                    \n\
  })                                                     \n\
          </code></pre>                                  \n\
        </div>                                           \n\
      </body>                                            \n\
    </html>'
}