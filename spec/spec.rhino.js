
load('/Library/Ruby/Gems/1.8/gems/visionmedia-jspec-2.5.0/lib/jspec.js')
load('lib/express.core.js')
load('lib/express.mime.js')
load('lib/express.view.js')

JSpec
.exec('spec/spec.core.js')
.exec('spec/spec.routing.js')
.exec('spec/spec.mime.js')
.exec('spec/spec.view.js')
.run({ failuresOnly : true, formatter : JSpec.formatters.Terminal })
.report()