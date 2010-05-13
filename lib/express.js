
require.paths.unshift(__dirname + '/support/ext/lib')
require.paths.unshift(__dirname + '/support/ejs/lib')
require.paths.unshift(__dirname + '/support/haml/lib')
require.paths.unshift(__dirname + '/support/sass/lib')
require.paths.unshift(__dirname + '/support/multipart/lib')
require('ext')
Class = require('support/class/lib/class').Class
require('express/core')