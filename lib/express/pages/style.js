
// Express - Pages - Style - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.style = '<style>                                                  \n\
    body {                                                                \n\
      font-family: "Helvetica Neue", "Lucida Grande", "Arial" sans-serif; \n\
      font-size: 13px;                                                    \n\
      text-align: center;                                                 \n\
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);                  \n\
      color: #555;                                                        \n\
    }                                                                     \n\
    h1, h2 {                                                              \n\
      margin: 0; \n\
      font-size: 22px;                                                    \n\
      color: #343434;                                                     \n\
    }                                                                     \n\
    h1 em, h2 em {                                                        \n\
      padding: 0 5px;                                                     \n\
      font-weight: normal;                                                \n\
    }                                                                     \n\
    h1 {                                                                  \n\
      font-size: 60px;                                                    \n\
    }                                                                     \n\
    #wrapper {                                                            \n\
      margin: 50px auto;                                                  \n\
      width: 600px;                                                       \n\
      text-align: left;                                                   \n\
    }                                                                     \n\
    ul {                                                                  \n\
      margin: 0;                                                          \n\
    }                                                                     \n\
    ul li {                                                               \n\
      margin: 0;                                                          \n\
      padding: 5px 0;                                                     \n\
    }                                                                     \n\
    ul li .path {                                                         \n\
      padding-left: 5px;                                                  \n\
      font-weight: bold;                                                  \n\
    }                                                                     \n\
    ul li .line {                                                         \n\
      padding-right: 5px;                                                 \n\
      font-style: italic;                                                 \n\
    }                                                                     \n\
    ul li:first-child .path {                                             \n\
      padding-left: 0;                                                    \n\
    }                                                                     \n\
    '