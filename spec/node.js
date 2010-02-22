
require.paths.unshift('spec', 'lib', 'spec/lib', 'spec/support/libxmljs')
require("jspec")
require("express")
require("express/spec")

print = puts
quit = process.exit
readFile = require('fs').readFileSync

function run(specs) {
  specs.forEach(function(spec){
    JSpec.exec('spec/spec.' + spec + '.js')
  })
}

specs = {
  independant: [
    'core',
    'routing',
    'utils',
    'request',
    'mime',
    'static',
    'collection',
    'plugins',
    'plugins.cache',
    'plugins.view',
    'plugins.common-logger',
    'plugins.content-length',
    'plugins.method-override',
    'plugins.body-decoder',
    'plugins.redirect',
    'plugins.hooks',
    'plugins.cookie',
    'plugins.session',
    'plugins.flash',
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

Express.environment = 'test'
JSpec.run({ reporter: JSpec.reporters.Terminal, failuresOnly: true }).report()