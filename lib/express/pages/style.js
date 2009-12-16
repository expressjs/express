
// Express - Pages - Style - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.style = '<style>                                                  \n\
    body {                                                                \n\
      font-family: "Helvetica Neue", "Lucida Grande", "Arial";            \n\
      font-size: 13px;                                                    \n\
      text-align: center;                                                 \n\
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#ECE9E9)); \n\
      color: #555;                                                        \n\
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);                  \n\
    }                                                                     \n\
    h1, h2, h3 {                                                          \n\
      margin: 0;                                                          \n\
      font-size: 22px;                                                    \n\
      color: #343434;                                                     \n\
    }                                                                     \n\
    h1 em, h2 em {                                                        \n\
      padding: 0 5px;                                                     \n\
      font-weight: normal;                                                \n\
    }                                                                     \n\
    h1 {                                                                  \n\
      text-shadow: 1px 2px 2px #ddd;                                      \n\
      font-size: 60px;                                                    \n\
    }                                                                     \n\
    h3 {                                                                  \n\
      margin: 5px 0 10px 0;                                               \n\
      padding-bottom: 5px;                                                \n\
      border-bottom: 1px solid #eee;                                      \n\
      font-size: 18px;                                                    \n\
    }                                                                     \n\
    #wrapper {                                                            \n\
      margin: 50px auto;                                                  \n\
      width: 750px;                                                       \n\
      text-align: left;                                                   \n\
    }                                                                     \n\
    ul {                                                                  \n\
      margin: 0;                                                          \n\
      padding: 0;                                                         \n\
    }                                                                     \n\
    ul li {                                                               \n\
      margin: 5px 0;                                                      \n\
      padding: 3px 8px;                                                   \n\
      list-style: none;                                                   \n\
      border: 1px solid #eee;                                             \n\
      -webkit-border-radius: 3px;                                         \n\
      -mox-border-radius: 3px;                                            \n\
      -webkit-transition-property: color, padding;                        \n\
      -webkit-transition-duration: 0.1s;                                  \n\
    }                                                                     \n\
    ul li:hover {                                                         \n\
      padding: 3px 20px;                                                  \n\
      cursor: pointer;                                                    \n\
      color: #2E2E2E;                                                     \n\
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
    p {                                                                   \n\
      line-height: 1.5;                                                   \n\
    }                                                                     \n\
    pre {                                                                 \n\
      margin: 0;                                                          \n\
      padding: 10px;                                                      \n\
      border: 1px solid #eee;                                             \n\
      -webkit-border-radius: 10px;                                        \n\
      -moz-border-radius: 10px;                                           \n\
      -webkit-box-shadow: 1px 1px 6px #ddd;                               \n\
      -moz-box-shadow: 1px 1px 6px #ddd;                                  \n\
    }                                                                     \n\
    table {                                                               \n\
      margin-bottom: 35px;                                                \n\
      width: 100%;                                                        \n\
      border-collapse: collapse;                                          \n\
    }                                                                     \n\
    table td {                                                            \n\
      padding: 5px 10px;                                                  \n\
      font-size: 14px;                                                    \n\
    }                                                                     \n\
    table tr {                                                            \n\
      border-bottom: 1px solid #fff;                                      \n\
    }                                                                     \n\
    table tr:last-child {                                                 \n\
      border-bottom: none;                                                \n\
    }                                                                     \n\
    table td:first-child {                                                \n\
      width: 150px;                                                       \n\
      color: #343434;                                                     \n\
    }                                                                     \n\
    </style>                                                              \n\
    '