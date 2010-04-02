
require.paths.unshift('spec', 'lib', 'spec/lib')
require("jspec")
require("express")
require("express/spec")

print = require('sys').puts
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
    'plugins',
    'plugins.cache',
    'plugins.view',
    'plugins.content-length',
    'plugins.method-override',
    'plugins.body-decoder',
    'plugins.redirect',
    'plugins.hooks',
    'plugins.cookie',
    'plugins.session',
    'plugins.flash',
    'plugins.static',
    ]
}

switch (process.ARGV[2]) {
  case 'all':
    run(specs.independant)
    break
  default: 
    run([process.ARGV[2]])
}

Express.environment = 'test'
JSpec.run({ reporter: JSpec.reporters.Terminal, failuresOnly: true }).report()