
require.paths.unshift('spec', 'lib', 'spec/lib', 'spec/support/libxmljs')
require("jspec")
require("express")
require("express/spec")

quit = process.exit
print = puts

readFile = function(path) {
  var result
  require('posix')
    .cat(path, "utf8")
    .addCallback(function(contents){ result = contents })
    .addErrback(function(){ throw new Error("failed to read file `" + path + "'") })
    .wait()
  return result
}

function run(specs) {
  specs.forEach(function(spec){
    JSpec.exec('spec/spec.' + spec + '.js')
  })
}

specs = {
  independant: [
    'core',
    'routing',
    'helpers',
    'request',
    'mime',
    'static',
    'collection',
    'plugins',
    'plugins.view',
    'plugins.common-logger',
    'plugins.content-length',
    'plugins.method-override',
    'plugins.body-decoder',
    'plugins.redirect',
    'plugins.hooks',
    'plugins.cookie',
    ],
  dependant: [
    'element-collection'
  ]
}

switch (process.ARGV[2]) {
  case 'independant':
    run(specs.independant)
    break
  case 'dependant':
    run(specs.dependant)
    break
  case 'all':
    run(specs.independant)
    run(specs.dependant)
    break
  default: 
    run([process.ARGV[2]])
}

JSpec.run({ reporter: JSpec.reporters.Terminal, failuresOnly: true }).report()