
var path = require('path')
require.paths.unshift(path.dirname(__filename) + '/support/js-oo/lib')
require.paths.unshift(path.dirname(__filename) + '/support/ejs/lib')
require.paths.unshift(path.dirname(__filename) + '/support/haml/lib')
require.paths.unshift(path.dirname(__filename) + '/support/sass/lib')
require('oo')
require('express/core')
