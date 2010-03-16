
require.paths.unshift(__dirname + '/support/ext/lib')
require.paths.unshift(__dirname + '/support/haml/lib')
require.paths.unshift(__dirname + '/support/sass/lib')
require('ext')
require('support/oo/lib/oo')
NewClass = require('support/class/lib/class').Class
require('express/core')