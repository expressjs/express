
require.paths.unshift('spec', 'spec/lib', 'lib')
require("jspec")
require("express")
require("express/spec")

quit = process.exit
print = puts

readFile = function(path) {
  var promise = require('posix').cat(path, "utf8")
  var result = ''
  promise.addErrback(function(){ throw "failed to read file `" + path + "'" })
  promise.addCallback(function(contents){
    result = contents
  })
  promise.wait()
  return result
}

if (process.ARGV[2])
  JSpec.exec('spec/spec.' + process.ARGV[2] + '.js')  
else
  JSpec
    .exec('spec/spec.core.js')
    .exec('spec/spec.routing.js')
    .exec('spec/spec.helpers.js')
    .exec('spec/spec.request.js')
    .exec('spec/spec.mime.js')
    .exec('spec/spec.static.js')
    .exec('spec/spec.collection.js')
    .exec('spec/spec.element-collection.js')
    .exec('spec/spec.plugins.js')
    .exec('spec/spec.plugins.view.js')
    .exec('spec/spec.plugins.common-logger.js')
    .exec('spec/spec.plugins.content-length.js')
    .exec('spec/spec.plugins.method-override.js')
    .exec('spec/spec.plugins.body-decoder.js')
    .exec('spec/spec.plugins.redirect.js')
    .exec('spec/spec.plugins.hooks.js')
    .exec('spec/spec.plugins.cookie.js')
JSpec.run({ formatter: JSpec.formatters.Terminal, failuresOnly: true })
JSpec.report()
