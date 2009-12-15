
// Express - Show Exceptions - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var style = '<style>                                                      \n\
    body {                                                                \n\
      font-family: "Helvetica Neue", "Lucida Grande", "Arial" sans-serif; \n\
      font-size: 13px;                                                    \n\
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);                  \n\
      color: #555;                                                        \n\
    }                                                                     \n\
    h1, h2 {                                                              \n\
      color: #343434;                                                     \n\
    }                                                                     \n\
  </style>'

exports.render = function(e) {
  contentType('html')
  var stack = $(e).map(function(val){
    return '<li>' + val + '</li>'
  })
  return '<html>                        \n\
      <head>                            \n\
        <title>Express -- Error</title> \n\
        ' + style + '                   \n\
      </head>                           \n\
      <body>                            \n\
        <h1>Express</h1>                \n\
        <h2>' + e + '</h2>              \n\
        <ul id="stacktrace">            \n\
          ' + stack + '                 \n\
        </ul>                           \n\
      </body>                           \n\
    </html>'
}